/*******************************************************************************
 * Copyright (c) 2016 Eviarc GmbH. All rights reserved.
 * 
 * NOTICE: All information contained herein is, and remains the property of
 * Eviarc GmbH and its suppliers, if any. The intellectual and technical
 * concepts contained herein are proprietary to Eviarc GmbH, and are protected
 * by trade secret or copyright law. Dissemination of this information or
 * reproduction of this material is strictly forbidden unless prior written
 * permission is obtained from Eviarc GmbH.
 ******************************************************************************/
"use strict";

const $translateId: string = "$translate";
const toasterId: string = "toaster";
const DTOptionsBuilderId: string = "DTOptionsBuilder";
const DTColumnBuilderId: string = "DTColumnBuilder";
const $filterId: string = "$filter";
const $scopeId: string = "$scope";
const $compileId: string = "$compile";
const $resourceId: string = "$resource";
const $rootScopeId: string = "$rootScope";
const ngResourceId: string = "ngResource";
const $locationId: string = "$location";
const $httpId: string = "$http";
const $cookiesId: string = "$cookies";
const $windowId: string = "$window";
const $intervalId: string = "$interval";
const $qId: string = "$q";
const FileUploaderId: string = "FileUploader";
const $routeParamsId: string = "$routeParams";
const ngImgCropId: string = "ngImgCrop";
const $routeProviderId: string = "$routeProvider";
const $httpProviderId: string = "$httpProvider";
const $uibModalId: string = "$uibModal";
const $injectorId: string = "$injector";
const $sceId: string = "$sce";

const moduleApp: string = "app";
const moduleAppController: string = moduleApp + ".controller";
const moduleServices: string = moduleApp + ".services";
const moduleDashboard: string = moduleApp + ".dashboard";
const moduleDashboardService: string = moduleDashboard + ".service";
const moduleAuthService: string = moduleApp + "authentication.service";
const moduleLogin: string = moduleApp + ".login";
const moduleLoginService: string = moduleLogin + ".service";
const moduleSignup: string = moduleApp + ".signup";
const moduleSignupResource: string = moduleSignup + ".resource";
const moduleSignupService: string = moduleSignup + ".service";
const moduleLead: string = moduleApp + ".lead";
const moduleLeadResource: string = moduleLead + ".resource";
const moduleLeadService: string = moduleLead + ".service";
const moduleLeadDataTableService: string = moduleLead + ".dataTableService";
const moduleOffer: string = moduleApp + ".offer";
const moduleOfferResource: string = moduleOffer + ".resource";
const moduleOfferService: string = moduleOffer + ".service";
const moduleOfferDataTableService: string = moduleOffer + ".dataTableService";
const moduleSale: string = moduleApp + ".sale";
const moduleSaleResource: string = moduleSale + ".resource";
const moduleSaleService: string = moduleSale + ".service";
const moduleSaleDataTableService: string = moduleSale + ".dataTableService";
const moduleProcess: string = moduleApp + ".process";
const moduleProcessResource: string = moduleProcess + ".resource";
const moduleUser: string = moduleApp + ".user";
const moduleUserDetail: string = moduleUser + ".detail";
const moduleUserResource: string = moduleUser + ".resource";
const moduleComment: string = moduleApp + ".comment";
const moduleCommentResource: string = moduleComment + ".resource";
const moduleStatistic: string = moduleApp + ".statistic";
const moduleStatisticResource: string = moduleStatistic + ".resource";
const moduleStatisticService: string = moduleStatistic + ".service";
const moduleSetting: string = moduleApp + ".settings";
const moduleSettingResource: string = moduleSetting + ".resource";
const moduleSettingService: string = moduleSetting + ".service";
const moduleProfile: string = moduleApp + ".profile";
const moduleProfileService: string = moduleProfile + ".service";
const moduleProduct: string = moduleApp + ".product";
const moduleProductDetail: string = moduleProduct + ".detail";
const moduleProductResource: string = moduleProduct + ".resource";
const moduleProductService: string = moduleProduct + ".service";
const moduleCustomer: string = moduleApp + ".customer";
const moduleCustomerDetail: string = moduleCustomer + ".detail";
const moduleCustomerResource: string = moduleCustomer + ".resource";
const moduleCustomerService: string = moduleCustomer + ".service";
const moduleWorkflow: string = moduleApp + ".workflow";
const moduleWorkflowService: string = moduleWorkflow + ".service";
const moduleFollowUp: string = moduleApp + ".followUp";
const moduleFile: string = moduleApp + ".file";
const moduleFileResource: string = moduleFile + ".resource";
const moduleFileService: string = moduleFile + ".service";
const moduleSmtp: string = moduleApp + ".smtp";
const moduleSmtpResource: string = moduleSmtp + ".resource";
const moduleSmtpService: string = moduleSmtp + ".service";
const moduleTemplate: string = moduleApp + ".template";
const moduleTemplateResource: string = moduleTemplate + ".resource";
const moduleTemplateService: string = moduleTemplate + ".service";
const moduleNotification: string = moduleApp + ".notification";
const moduleNotificationResource: string = moduleNotification + ".resource";
const moduleNotificationService: string = moduleNotification + ".service";
const moduleTenant: string = moduleApp + ".tenant";
const moduleTenantResource: string = moduleTenant + ".resource";
const moduleTenantService: string = moduleTenant + ".service";
const moduleRegistration: string = moduleApp + ".registration";
const moduleRegistrationService: string = moduleRegistration + ".service";
const moduleSubdomain: string = moduleApp + ".subdomain";
const moduleSubdomainService: string = moduleSubdomain + ".service";

const moduleTranslate: string = "pascalprecht.translate";
const moduleNgResource: string = "ngResource";
const moduleNgRoute: string = "ngRoute";
const moduleNgAnimate: string = "ngAnimate";
const moduleNgCookies: string = "ngCookies";
const moduleDatatables: string = "datatables";
const moduleDatatablesBootstrap: string = "datatables.bootstrap";
const moduleDatatablesButtons: string = "datatables.buttons";
const moduleUiSortable: string = "ui.sortable";
const moduleNgSwitchery: string = "NgSwitchery";
const moduleToaster: string = "toaster";
const moduleNgImgCrop: string = "ngImgCrop";
const moduleHighchartsNg: string = "highcharts-ng";
const moduleUIBootstrap: string = "ui.bootstrap";
const moduleSummernote: string = "summernote";
const moduleFootable: string = "ui.footable";
const moduleSanitize: string = "ngSanitize";
const moduleSweetAlert: string = "oitozero.ngSweetAlert";

const workflowLead: string = "LEAD";
const workflowOffer: string = "OFFER";
const workflowSale: string = "SALE";

