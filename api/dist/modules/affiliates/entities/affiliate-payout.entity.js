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
exports.AffiliatePayout = exports.PayoutStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const affiliate_entity_1 = require("./affiliate.entity");
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["REQUESTED"] = "REQUESTED";
    PayoutStatus["PROCESSING"] = "PROCESSING";
    PayoutStatus["PAID"] = "PAID";
    PayoutStatus["REJECTED"] = "REJECTED";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
let AffiliatePayout = class AffiliatePayout {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, affiliateId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, periodStart: { required: true, type: () => Date }, periodEnd: { required: true, type: () => Date }, status: { required: true, enum: require("./affiliate-payout.entity").PayoutStatus }, paymentReference: { required: true, type: () => String }, processedByUserId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, affiliate: { required: true, type: () => require("./affiliate.entity").Affiliate } };
    }
};
exports.AffiliatePayout = AffiliatePayout;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AffiliatePayout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'affiliate_id' }),
    __metadata("design:type", String)
], AffiliatePayout.prototype, "affiliateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], AffiliatePayout.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'period_start' }),
    __metadata("design:type", Date)
], AffiliatePayout.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'period_end' }),
    __metadata("design:type", Date)
], AffiliatePayout.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PayoutStatus,
        default: PayoutStatus.REQUESTED,
    }),
    __metadata("design:type", String)
], AffiliatePayout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100, name: 'payment_reference' }),
    __metadata("design:type", String)
], AffiliatePayout.prototype, "paymentReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'processed_by_user_id' }),
    __metadata("design:type", String)
], AffiliatePayout.prototype, "processedByUserId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AffiliatePayout.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AffiliatePayout.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => affiliate_entity_1.Affiliate, (affiliate) => affiliate.payouts),
    (0, typeorm_1.JoinColumn)({ name: 'affiliate_id' }),
    __metadata("design:type", affiliate_entity_1.Affiliate)
], AffiliatePayout.prototype, "affiliate", void 0);
exports.AffiliatePayout = AffiliatePayout = __decorate([
    (0, typeorm_1.Entity)('affiliate_payouts')
], AffiliatePayout);
//# sourceMappingURL=affiliate-payout.entity.js.map