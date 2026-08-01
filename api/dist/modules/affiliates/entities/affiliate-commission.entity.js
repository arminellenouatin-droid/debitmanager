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
exports.AffiliateCommission = exports.CommissionStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const affiliate_entity_1 = require("./affiliate.entity");
const company_entity_1 = require("../../companies/entities/company.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
var CommissionStatus;
(function (CommissionStatus) {
    CommissionStatus["PENDING"] = "PENDING";
    CommissionStatus["VALIDATED"] = "VALIDATED";
    CommissionStatus["PAID"] = "PAID";
    CommissionStatus["REJECTED"] = "REJECTED";
})(CommissionStatus || (exports.CommissionStatus = CommissionStatus = {}));
let AffiliateCommission = class AffiliateCommission {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, affiliateId: { required: true, type: () => String }, companyId: { required: true, type: () => String }, subscriptionId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, status: { required: true, enum: require("./affiliate-commission.entity").CommissionStatus }, validatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, affiliate: { required: true, type: () => require("./affiliate.entity").Affiliate }, company: { required: true, type: () => require("../../companies/entities/company.entity").Company }, subscription: { required: true, type: () => require("../../subscriptions/entities/subscription.entity").Subscription } };
    }
};
exports.AffiliateCommission = AffiliateCommission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AffiliateCommission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'affiliate_id' }),
    __metadata("design:type", String)
], AffiliateCommission.prototype, "affiliateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_id' }),
    __metadata("design:type", String)
], AffiliateCommission.prototype, "companyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subscription_id' }),
    __metadata("design:type", String)
], AffiliateCommission.prototype, "subscriptionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AffiliateCommission.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CommissionStatus,
        default: CommissionStatus.PENDING,
    }),
    __metadata("design:type", String)
], AffiliateCommission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'validated_at' }),
    __metadata("design:type", Date)
], AffiliateCommission.prototype, "validatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AffiliateCommission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => affiliate_entity_1.Affiliate, (affiliate) => affiliate.commissions),
    (0, typeorm_1.JoinColumn)({ name: 'affiliate_id' }),
    __metadata("design:type", affiliate_entity_1.Affiliate)
], AffiliateCommission.prototype, "affiliate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_entity_1.Company),
    (0, typeorm_1.JoinColumn)({ name: 'company_id' }),
    __metadata("design:type", company_entity_1.Company)
], AffiliateCommission.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => subscription_entity_1.Subscription),
    (0, typeorm_1.JoinColumn)({ name: 'subscription_id' }),
    __metadata("design:type", subscription_entity_1.Subscription)
], AffiliateCommission.prototype, "subscription", void 0);
exports.AffiliateCommission = AffiliateCommission = __decorate([
    (0, typeorm_1.Entity)('affiliate_commissions')
], AffiliateCommission);
//# sourceMappingURL=affiliate-commission.entity.js.map