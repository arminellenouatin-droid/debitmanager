import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { Company, CompanyStatus } from '../entities/company.entity';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Affiliate } from '../../affiliates/entities/affiliate.entity';
import { ReferralTracking } from '../../affiliates/entities/referral-tracking.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(Affiliate)
    private affiliatesRepository: Repository<Affiliate>,
    @InjectRepository(ReferralTracking)
    private referralTrackingRepository: Repository<ReferralTracking>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, ownerId: string) {
    const { activityType, referralCode } = createCompanyDto;

    // Generate unique company code
    const uniqueCode = await this.generateUniqueCode();

    // Determine activity coefficient
    const activityCoefficient = this.getActivityCoefficient(activityType as any);

    // Handle referral if provided
    let affiliateId = null;
    let referralTrackingId = null;

    if (referralCode) {
      const affiliate = await this.affiliatesRepository.findOne({
        where: { referralCode, status: 'ACTIVE' as any },
      });

      if (affiliate) {
        affiliateId = affiliate.id;

        // Create referral tracking
        const tracking = this.referralTrackingRepository.create({
          affiliateId: affiliate.id,
          trackingToken: this.generateTrackingToken(),
          clickedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          convertedCompanyId: null, // Will be updated after creation
        });

        const savedTracking = await this.referralTrackingRepository.save(tracking);
        referralTrackingId = savedTracking.id;
      }
    }

    // Create company
    const company = this.companiesRepository.create({
      name: createCompanyDto.name,
      activityType: createCompanyDto.activityType as any,
      country: createCompanyDto.country,
      currency: createCompanyDto.currency,
      language: createCompanyDto.language,
      tenantId: uniqueCode, // Use unique code as tenant ID
      uniqueCode,
      activityCoefficient,
      status: CompanyStatus.TRIAL,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      ownerUserId: ownerId,
      affiliateId,
      referralTrackingId,
    });

    const savedCompany = await this.companiesRepository.save(company);

    // Update referral tracking with company ID
    if (referralTrackingId) {
      await this.referralTrackingRepository.update(referralTrackingId, {
        convertedCompanyId: savedCompany.id,
        convertedAt: new Date(),
      });
    }

    return this.sanitizeCompany(savedCompany);
  }

  async findOne(id: string, tenantId: string) {
    const company = await this.companiesRepository.findOne({
      where: { id, tenantId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.sanitizeCompany(company);
  }

  async findByUniqueCode(uniqueCode: string) {
    const company = await this.companiesRepository.findOne({
      where: { uniqueCode },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.sanitizeCompany(company);
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, tenantId: string) {
    const company = await this.findOne(id, tenantId);

    const updateData: any = {};
    if (updateCompanyDto.name) updateData.name = updateCompanyDto.name;
    if (updateCompanyDto.activityType) updateData.activityType = updateCompanyDto.activityType as any;
    if (updateCompanyDto.country) updateData.country = updateCompanyDto.country;
    if (updateCompanyDto.currency) updateData.currency = updateCompanyDto.currency;
    if (updateCompanyDto.language) updateData.language = updateCompanyDto.language;

    await this.companiesRepository.update(id, updateData);

    const updated = await this.companiesRepository.findOne({ where: { id } });
    return this.sanitizeCompany(updated);
  }

  async getJoinCode(id: string, tenantId: string) {
    const company = await this.findOne(id, tenantId);
    return { uniqueCode: company.uniqueCode };
  }

  private async generateUniqueCode(): Promise<string> {
    let code: string;
    let attempts = 0;

    do {
      code = this.generateRandomCode(10);
      attempts++;
      if (attempts > 100) {
        throw new ConflictException('Could not generate unique code');
      }
    } while (await this.companiesRepository.findOne({ where: { uniqueCode: code } }));

    return code;
  }

  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateTrackingToken(): string {
    return randomBytes(32).toString('hex');
  }

  private getActivityCoefficient(activityType: string): number {
    switch (activityType) {
      case 'BUVETTE':
        return 1.0;
      case 'BAR_RESTAURANT':
        return 1.5;
      case 'NIGHTCLUB_LOUNGE':
        return 2.0;
      default:
        return 1.0;
    }
  }

  private sanitizeCompany(company: Company) {
    const { ...sanitized } = company;
    return sanitized;
  }
}
