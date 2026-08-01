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
exports.Payment = exports.PaymentStatus = exports.PaymentAggregator = exports.PaymentMethod = exports.PaymentPurpose = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var PaymentPurpose;
(function (PaymentPurpose) {
    PaymentPurpose["ORDER"] = "ORDER";
    PaymentPurpose["SUBSCRIPTION"] = "SUBSCRIPTION";
    PaymentPurpose["PAYROLL"] = "PAYROLL";
})(PaymentPurpose || (exports.PaymentPurpose = PaymentPurpose = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["MOBILE_MONEY"] = "MOBILE_MONEY";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentAggregator;
(function (PaymentAggregator) {
    PaymentAggregator["KKIAPAY"] = "KKIAPAY";
    PaymentAggregator["MONEROO"] = "MONEROO";
    PaymentAggregator["CINETPAY"] = "CINETPAY";
    PaymentAggregator["NONE"] = "NONE";
})(PaymentAggregator || (exports.PaymentAggregator = PaymentAggregator = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Payment = class Payment {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, paymentPurpose: { required: true, enum: require("./payment.entity").PaymentPurpose }, referenceId: { required: true, type: () => String }, amount: { required: true, type: () => Number }, method: { required: true, enum: require("./payment.entity").PaymentMethod }, aggregator: { required: true, enum: require("./payment.entity").PaymentAggregator }, aggregatorReference: { required: true, type: () => String }, platformCommissionAmount: { required: true, type: () => Number }, status: { required: true, enum: require("./payment.entity").PaymentStatus }, webhookReceivedAt: { required: true, type: () => Date }, reconciled: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Payment = Payment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Payment.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentPurpose,
        name: 'payment_purpose',
    }),
    __metadata("design:type", String)
], Payment.prototype, "paymentPurpose", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id' }),
    __metadata("design:type", String)
], Payment.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer' }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentMethod,
    }),
    __metadata("design:type", String)
], Payment.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentAggregator,
        default: PaymentAggregator.NONE,
    }),
    __metadata("design:type", String)
], Payment.prototype, "aggregator", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100, name: 'aggregator_reference' }),
    __metadata("design:type", String)
], Payment.prototype, "aggregatorReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', name: 'platform_commission_amount', default: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "platformCommissionAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'webhook_received_at' }),
    __metadata("design:type", Date)
], Payment.prototype, "webhookReceivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Payment.prototype, "reconciled", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Payment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Payment.prototype, "updatedAt", void 0);
exports.Payment = Payment = __decorate([
    (0, typeorm_1.Entity)('payments'),
    (0, typeorm_1.Index)(['tenantId'])
], Payment);
//# sourceMappingURL=payment.entity.js.map