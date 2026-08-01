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
exports.Affiliate = exports.AffiliatePaymentMethod = exports.CommissionMode = exports.AffiliateStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const referral_tracking_entity_1 = require("./referral-tracking.entity");
const affiliate_commission_entity_1 = require("./affiliate-commission.entity");
const affiliate_payout_entity_1 = require("./affiliate-payout.entity");
var AffiliateStatus;
(function (AffiliateStatus) {
    AffiliateStatus["PENDING_VALIDATION"] = "PENDING_VALIDATION";
    AffiliateStatus["ACTIVE"] = "ACTIVE";
    AffiliateStatus["SUSPENDED"] = "SUSPENDED";
    AffiliateStatus["REJECTED"] = "REJECTED";
})(AffiliateStatus || (exports.AffiliateStatus = AffiliateStatus = {}));
var CommissionMode;
(function (CommissionMode) {
    CommissionMode["FIRST_PAYMENT"] = "FIRST_PAYMENT";
    CommissionMode["RECURRING"] = "RECURRING";
})(CommissionMode || (exports.CommissionMode = CommissionMode = {}));
var AffiliatePaymentMethod;
(function (AffiliatePaymentMethod) {
    AffiliatePaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
    AffiliatePaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
})(AffiliatePaymentMethod || (exports.AffiliatePaymentMethod = AffiliatePaymentMethod = {}));
let Affiliate = class Affiliate {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, referralCode: { required: true, type: () => String }, referralLink: { required: true, type: () => String }, paymentMethod: { required: true, enum: require("./affiliate.entity").AffiliatePaymentMethod }, paymentAccountRef: { required: true, type: () => String }, status: { required: true, enum: require("./affiliate.entity").AffiliateStatus }, commissionRateOverride: { required: true, type: () => Number }, commissionModeOverride: { required: true, enum: require("./affiliate.entity").CommissionMode }, referredBy: { required: true, type: () => String }, commissionBalance: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, user: { required: true, type: () => require("../../users/entities/user.entity").User }, referralTrackings: { required: true, type: () => [require("./referral-tracking.entity").ReferralTracking] }, commissions: { required: true, type: () => [require("./affiliate-commission.entity").AffiliateCommission] }, payouts: { required: true, type: () => [require("./affiliate-payout.entity").AffiliatePayout] } };
    }
};
exports.Affiliate = Affiliate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Affiliate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Affiliate.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Affiliate.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 20, name: 'referral_code' }),
    __metadata("design:type", String)
], Affiliate.prototype, "referralCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255, name: 'referral_link' }),
    __metadata("design:type", String)
], Affiliate.prototype, "referralLink", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AffiliatePaymentMethod,
    }),
    __metadata("design:type", String)
], Affiliate.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, name: 'payment_account_ref' }),
    __metadata("design:type", String)
], Affiliate.prototype, "paymentAccountRef", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AffiliateStatus,
        default: AffiliateStatus.PENDING_VALIDATION,
    }),
    __metadata("design:type", String)
], Affiliate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_rate_override', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Affiliate.prototype, "commissionRateOverride", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CommissionMode,
        name: 'commission_mode_override',
        nullable: true,
    }),
    __metadata("design:type", String)
], Affiliate.prototype, "commissionModeOverride", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'referred_by', nullable: true }),
    __metadata("design:type", String)
], Affiliate.prototype, "referredBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'commission_balance', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Affiliate.prototype, "commissionBalance", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Affiliate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Affiliate.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.affiliate),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Affiliate.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => referral_tracking_entity_1.ReferralTracking, (tracking) => tracking.affiliate),
    __metadata("design:type", Array)
], Affiliate.prototype, "referralTrackings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => affiliate_commission_entity_1.AffiliateCommission, (commission) => commission.affiliate),
    __metadata("design:type", Array)
], Affiliate.prototype, "commissions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => affiliate_payout_entity_1.AffiliatePayout, (payout) => payout.affiliate),
    __metadata("design:type", Array)
], Affiliate.prototype, "payouts", void 0);
exports.Affiliate = Affiliate = __decorate([
    (0, typeorm_1.Entity)('affiliates')
], Affiliate);
//# sourceMappingURL=affiliate.entity.js.map