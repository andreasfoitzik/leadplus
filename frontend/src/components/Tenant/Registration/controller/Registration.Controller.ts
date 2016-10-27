/// <reference path="../../../Tenant/Registration/controller/Registration.Service.ts" />
/// <reference path="../../../Tenant/model/Tenant.Model.ts" />
/// <reference path="../../../Tenant/controller/Tenant.Service.ts" />
/// <reference path="../../../Signup/model/Signup.Model.ts" />
/// <reference path="../../../Signup/controller/SignUp.Service.ts" />
/// <reference path="../../../Login/controller/Login.Service.ts" />
/// <reference path="../../../Login/Model/Credentials.Model.ts" />

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

const RegistrationControllerId: string = "RegistrationController";

class RegistrationController {

    private $inject = [RegistrationServiceId, SignupServiceId, TenantServiceId, LoginServiceId, $httpId, $locationId];

    signupService;
    registrationService: RegistrationService;
    tenantService: TenantService;
    loginService;

    credentials: Credentials;
    tenant: Tenant;
    user: Signup;

    http;
    location;

    constructor(RegistrationService, SignupService, TenantService, LoginService, $http, $location) {
        this.registrationService = RegistrationService;
        this.signupService = SignupService;
        this.tenantService = TenantService;
        this.loginService = LoginService;
        this.tenant = new Tenant();
        this.user = new Signup();
        this.credentials = new Credentials();
        this.http = $http;
        this.location = $location;
    }

    uniqueTenantKey(): void {
        this.registrationService.uniqueTenantKey(this.tenant);
    }

    uniqueEmail(): void {
        this.signupService.uniqueEmail(this.user);
    }

    register(): void {
        let self = this;
        this.tenant.license.term = newTimestamp();
        this.tenant.license.trial = false;

        this.credentials.email = this.user.email;
        this.credentials.password = this.user.password;
        this.credentials.tenant = this.tenant.tenantKey + "." + this.location.host();

        self.http.defaults.headers.common["X-TenantID"] = this.location.host();
        this.tenantService.save(this.tenant).then(function (createdTenant: Tenant) {
            self.http.defaults.headers.common["X-TenantID"] = self.credentials.tenant;
            self.signupService.signup(self.user).then(function (createdUser: User) {
                self.loginService.login(self.credentials);
            }, function () {
                console.log("ERRRROR - Signup - Save");
            });
        }, function () {
            console.log("ERRRROR - Tenant - Save");
        });
    }
}

angular.module(moduleRegistration, [ngResourceId]).controller(RegistrationControllerId, RegistrationController);