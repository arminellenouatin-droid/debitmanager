"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliatesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const affiliate_entity_1 = require("./entities/affiliate.entity");
const company_entity_1 = require("../companies/entities/company.entity");
const subscription_entity_1 = require("../subscriptions/entities/subscription.entity");
const affiliates_service_1 = require("./services/affiliates.service");
const affiliates_controller_1 = require("./controllers/affiliates.controller");
let AffiliatesModule = class AffiliatesModule {
};
exports.AffiliatesModule = AffiliatesModule;
exports.AffiliatesModule = AffiliatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([affiliate_entity_1.Affiliate, company_entity_1.Company, subscription_entity_1.Subscription]),
        ],
        controllers: [affiliates_controller_1.AffiliatesController],
        providers: [affiliates_service_1.AffiliatesService],
        exports: [affiliates_service_1.AffiliatesService],
    })
], AffiliatesModule);
//# sourceMappingURL=affiliates.module.js.map