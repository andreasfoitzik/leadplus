/// <reference path="../../app/App.Resource.ts" />
/// <reference path="../../User/model/User.Model.ts" />
/// <reference path="../../User/model/Role.Model.ts" />
/// <reference path="../../User/model/Language.Model.ts" />
/// <reference path="../../Setting/model/Setting.Model.ts" />
/// <reference path="../../Setting/controller/Setting.Controller.ts" />
/// <reference path="../../Setting/model/Template.Model.ts" />

/*******************************************************************************
 * Copyright (c) 2016 Eviarc GmbH.
 * All rights reserved.  
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Eviarc GmbH and its suppliers, if any.  
 * The intellectual and technical concepts contained
 * herein are proprietary to Eviarc GmbH,
 * and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Eviarc GmbH.
 *******************************************************************************/
"use strict";

const SettingServiceId: string = "SettingService";

class SettingService {

    private $inject = [$filterId, toasterId, $translateId, $rootScopeId, SettingResourceId, SmtpResourceId, UserResourceId, FileResourceId, TemplateResourceId, $uibModalId];

    settingsResource;
    smtpResource;
    userResource;
    fileResource;
    templateResource;

    rootScope;
    translate;
    filter;
    toaster;
    counter;

    uibModal;

    roleSelection = Array<any>();
    users: Array<User>;

    constructor($filter, toaster, $translate, $rootScope, SettingResource, SmtpResource, UserResource, FileResource, TemplateResource, $uibModal) {
        this.filter = $filter;
        this.toaster = toaster;
        this.rootScope = $rootScope;
        this.translate = $translate;
        this.settingsResource = SettingResource.resource;
        this.smtpResource = SmtpResource.resource;
        this.userResource = UserResource.resource;
        this.fileResource = FileResource.resource;
        this.templateResource = TemplateResource.resource;

        this.loadUsers();
        this.uibModal = $uibModal;

    }

    loadUsers() {
        let self = this;
        this.settingsResource.getAll().$promise.then(function (result) {
            self.users = result;
            for (let user of result) {
                self.roleSelection[result[user].id] = result[user].role;
            }
        });
    }

    activateUser(user: User) {
        let self = this;
        this.settingsResource.activate({ id: user.id }, true).$promise.then(function () {
            self.filter("filter")(self.users, { id: user.id })[0].enabled = true;
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_ACCESS_GRANTED"));
        }, function () {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_ACCESS_GRANTED_ERROR"));
        });
    }

    deactivateUser(user: User) {
        let self = this;
        this.settingsResource.activate({ id: user.id }, false).$promise.then(function () {
            self.filter("filter")(self.users, { id: user.id })[0].enabled = false;
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_ACCESS_REVOKED"));
        }, function () {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_ACCESS_REVOKED_ERROR"));
        });
    }

    changeRole(user: User) {
        let self = this;
        this.settingsResource.changeRole({ id: 4, role: this.roleSelection[user.id] }, {}).$promise.then(function () {
            // set rootScope role
            self.filter("filter")(self.users, { id: user.id })[0].role = user.role;
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_SET_ROLE"));
        }, function () {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_SET_ROLE_ERROR"));
        });
    }

    hasRight(user: User): boolean {
        if (user.username === this.rootScope.globals.user.username
            || (user.role === this.rootScope.globals.user.role)
            || this.rootScope.globals.user.role === Role.USER
            || user.role === Role.SUPERADMIN) {
            return true;
        } else {
            return false;
        }
    }

    testConnection(smtp: Setting) {
        let self = this;
        console.log("Smtp");
        console.log(this.rootScope.globals.user.setting);
        this.smtpResource.test(this.rootScope.globals.user.setting).$promise.then(function () {
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_TEST"));
        }, function () {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_TEST_ERROR"));
        });
    }

    save(smtp: Setting) {
        let self = this;
        console.log("Smtp");
        console.log(this.rootScope.globals.user.setting);
        this.userResource.setSmtpConnection({ id: this.rootScope.globals.user.id }, this.rootScope.globals.user.setting).$promise.then(function () {
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_SAVE"));
        }, function () {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_SAVE_ERROR"));
        });
    }

    openEmailTemplateModal() {
        this.uibModal.open({
            templateUrl: "http://localhost:8080/components/Setting/view/Setting.Email.Template.Modal.html",
            controller: SettingController,
            controllerAs: "settingCtrl",
            size: "lg",
            resolve: {
                offer: function () {
                    return "";
                }
            }
        });
    }

    saveEmailTemplate(template: Template) {
        console.log("createEmailTemplateModal");
        console.log(template);

        let self = this;
        this.templateResource.uploadTemplate({ template }).$promise.then(function () {
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_SAVE"));
        }, function () {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_SAVE_ERROR"));
        });
    }

}

angular.module(moduleSettingService, [ngResourceId]).service(SettingServiceId, SettingService);

