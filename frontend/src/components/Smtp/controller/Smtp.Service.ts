/// <reference path="../../app/App.Resource.ts" />
/// <reference path="../../Smtp/model/Smtp.Model.ts" />

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

const SmtpServiceId: string = "SmtpService";

class SmtpService {

    private $inject = [toasterId, $translateId, $rootScopeId, SmtpResourceId, UserResourceId, $qId];

    smtpResource;
    userResource;
    q;
    currentSmtp: Smtp;

    rootScope;
    translate;
    toaster;
    currentPasswordLength: number = 10;

    constructor(toaster, $translate, $rootScope, SmtpResource, UserResource, $q) {
        this.toaster = toaster;
        this.rootScope = $rootScope;
        this.translate = $translate;
        this.q = $q;
        this.smtpResource = SmtpResource.resource;
        this.userResource = UserResource.resource;
        this.getSMtp();
    }

    test() {
        let self = this;
        this.save().then(function () {
            self.smtpResource.testSmtp({ id: self.currentSmtp.id, smtpKey: self.rootScope.globals.user.smtpKey }).$promise.then(function () {
                self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_TEST"));
            }, function () {
                self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_TEST_ERROR"));
            });
        });

    }

    getSMtp() {
        let self = this;
        this.smtpResource.getByUserId({ id: this.rootScope.globals.user.id }).$promise.then((data) => {
            self.currentSmtp = data;
            self.currentSmtp.stringPassword = "";
            for (let i = 0; i < self.currentPasswordLength; i++) {
                self.currentSmtp.stringPassword += "x";
            }
        });
    }
    save(): IPromise<any> {
        let defer = this.q.defer();
        this.currentSmtp.user = this.rootScope.globals.user;
        this.currentPasswordLength = this.currentSmtp.stringPassword !== null ? this.currentSmtp.stringPassword.length : this.currentPasswordLength;
        this.currentSmtp.password = this.currentSmtp.stringPassword !== null ? btoa(this.currentSmtp.stringPassword) : null;
        let self = this;
        this.smtpResource.createSmtp({ smtpKey: self.rootScope.globals.user.smtpKey }, this.currentSmtp).$promise.then(function (data) {
            self.currentSmtp = data;
            self.currentSmtp.stringPassword = "";
            for (let i = 0; i < self.currentPasswordLength; i++) {
                self.currentSmtp.stringPassword += "x";
            }
            self.toaster.pop("success", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_SAVE"));
            defer.resolve(self.currentSmtp);
        }, function (error) {
            self.toaster.pop("error", "", self.translate.instant("SETTING_TOAST_EMAIL_MANAGEMENT_CONNECTION_SAVE_ERROR"));
            defer.reject(error);
        });
        return defer.promise;
    }
}

angular.module(moduleSmtpService, [ngResourceId]).service(SmtpServiceId, SmtpService);

