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
exports.Company = exports.CompanyStatus = exports.ActivityType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const subscription_entity_1 = require("../../subscriptions/entities/subscription.entity");
var ActivityType;
(function (ActivityType) {
    ActivityType["BUVETTE"] = "BUVETTE";
    ActivityType["BAR_RESTAURANT"] = "BAR_RESTAURANT";
    ActivityType["NIGHTCLUB_LOUNGE"] = "NIGHTCLUB_LOUNGE";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var CompanyStatus;
(function (CompanyStatus) {
    CompanyStatus["TRIAL"] = "TRIAL";
    CompanyStatus["ACTIVE"] = "ACTIVE";
    CompanyStatus["GRACE_PERIOD"] = "GRACE_PERIOD";
    CompanyStatus["SUSPENDED"] = "SUSPENDED";
    CompanyStatus["EXPIRED"] = "EXPIRED";
    CompanyStatus["CANCELLED"] = "CANCELLED";
})(CompanyStatus || (exports.CompanyStatus = CompanyStatus = {}));
let Company = class Company {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, name: { required: true, type: () => String }, activityType: { required: true, enum: require("./company.entity").ActivityType }, uniqueCode: { required: true, type: () => String }, country: { required: true, type: () => String }, currency: { required: true, type: () => String }, language: { required: true, type: () => String }, logoUrl: { required: true, type: () => String }, address: { required: true, type: () => String }, status: { required: true, enum: require("./company.entity").CompanyStatus }, trialEndsAt: { required: true, type: () => Date }, ownerUserId: { required: true, type: () => String }, affiliateId: { required: true, type: () => String }, referralTrackingId: { required: true, type: () => String }, activityCoefficient: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, owner: { required: true, type: () => require("../../users/entities/user.entity").User }, subscriptions: { required: true, type: () => [require("../../subscriptions/entities/subscription.entity").Subscription] } };
    }
};
exports.Company = Company;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Company.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tenant_id' }),
    __metadata("design:type", String)
], Company.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ActivityType,
    }),
    __metadata("design:type", String)
], Company.prototype, "activityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 10, name: 'unique_code' }),
    __metadata("design:type", String)
], Company.prototype, "uniqueCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 2 }),
    __metadata("design:type", String)
], Company.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'XOF' }),
    __metadata("design:type", String)
], Company.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 5, default: 'fr' }),
    __metadata("design:type", String)
], Company.prototype, "language", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Company.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CompanyStatus,
        default: CompanyStatus.TRIAL,
    }),
    __metadata("design:type", String)
], Company.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'trial_ends_at' }),
    __metadata("design:type", Date)
], Company.prototype, "trialEndsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_user_id' }),
    __metadata("design:type", String)
], Company.prototype, "ownerUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'affiliate_id' }),
    __metadata("design:type", String)
], Company.prototype, "affiliateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'referral_tracking_id' }),
    __metadata("design:type", String)
], Company.prototype, "referralTrackingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activity_coefficient', type: 'decimal', precision: 5, scale: 2, default: 1.0 }),
    __metadata("design:type", Number)
], Company.prototype, "activityCoefficient", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Company.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'owner_user_id' }),
    __metadata("design:type", user_entity_1.User)
], Company.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => subscription_entity_1.Subscription, (subscription) => subscription.company),
    __metadata("design:type", Array)
], Company.prototype, "subscriptions", void 0);
exports.Company = Company = __decorate([
    (0, typeorm_1.Entity)('companies'),
    (0, typeorm_1.Index)(['tenantId'])
], Company);
//# sourceMappingURL=company.entity.js.map