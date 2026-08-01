"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralTracking = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const affiliate_entity_1 = require("./affiliate.entity");
const company_entity_1 = require("../../companies/entities/company.entity");
let ReferralTracking = class ReferralTracking {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, affiliateId: { required: true, type: () => String }, trackingToken: { required: true, type: () => String }, clickedAt: { required: true, type: () => Date }, source: { required: true, type: () => String }, convertedCompanyId: { required: true, type: () => String }, convertedAt: { required: true, type: () => Date }, expiresAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, affiliate: { required: true, type: () => require("./affiliate.entity").Affiliate }, convertedCompany: { required: false, type: () => require("../../companies/entities/company.entity").Company } };
    }
};
exports.ReferralTracking = ReferralTracking;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReferralTracking.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'affiliate_id' }),
    __metadata("design:type", String)
], ReferralTracking.prototype, "affiliateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 64, name: 'tracking_token' }),
    __metadata("design:type", String)
], ReferralTracking.prototype, "trackingToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clicked_at' }),
    __metadata("design:type", Date)
], ReferralTracking.prototype, "clickedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], ReferralTracking.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'converted_company_id' }),
    __metadata("design:type", String)
], ReferralTracking.prototype, "convertedCompanyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'converted_at' }),
    __metadata("design:type", Date)
], ReferralTracking.prototype, "convertedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at' }),
    __metadata("design:type", Date)
], ReferralTracking.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReferralTracking.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => affiliate_entity_1.Affiliate, (affiliate) => affiliate.referralTrackings),
    (0, typeorm_1.JoinColumn)({ name: 'affiliate_id' }),
    __metadata("design:type", affiliate_entity_1.Affiliate)
], ReferralTracking.prototype, "affiliate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'converted_company_id' }),
    __metadata("design:type", company_entity_1.Company)
], ReferralTracking.prototype, "convertedCompany", void 0);
exports.ReferralTracking = ReferralTracking = __decorate([
    (0, typeorm_1.Entity)('referral_tracking')
], ReferralTracking);
//# sourceMappingURL=referral-tracking.entity.js.map