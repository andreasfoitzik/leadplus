/*/// <reference path="../../app/App.Common.ts" />
/// <reference path="../../app/App.Constants.ts" />
/// <reference path="../../app/App.Resource.ts" />
/// <reference path="../../User/Model/User.Model.ts" />
/// <reference path="../../Common/model/OrderPosition.Model.ts" />
/// <reference path="../../common/model/Process.Model.ts" />
/// <reference path="../../common/model/Activity.enum.ts" />
/// <reference path="../../common/model/Processor.Model.ts" />
/// <reference path="../../Lead/model/Lead.Model.ts" />
/// <reference path="../../Workflow/controller/Workflow.Service.ts" />
/// <reference path="../../Customer/Controller/Customer.Service.ts" />
/// <reference path="../../Product/Controller/Product.Service.ts" />
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
/*
"use strict";

const LeadServiceId: string = "LeadService";

class LeadService implements IWorkflowService {

    $inject = [$qId, $rootScopeId, $translateId, toasterId, $compileId, ProcessResourceId, CustomerResourceId, LeadResourceId, WorkflowServiceId, CustomerServiceId, ProductServiceId, TemplateServiceId, SourceServiceId, ProcessServiceId];
    processResource;
    customerResource;
    leadResource;
    workflowService: WorkflowService;
    customerService: CustomerService;
    productService: ProductService;
    sourceService: SourceService;
    processService: ProcessService;
    translate;
    rootScope;
    toaster;
    compile;
    templateService;

    rows: { [key: number]: any } = {};

    constructor(private $q, $rootScope, $translate, toaster, $compile, ProcessResource, CustomerResource, LeadResource, WorkflowService, CustomerService, ProductService, TemplateService, SourceService, ProcessService) {
        this.templateService = TemplateService;
        this.translate = $translate;
        this.rootScope = $rootScope;
        this.toaster = toaster;
        this.compile = $compile;
        this.processResource = ProcessResource.resource;
        this.customerResource = CustomerResource.resource;
        this.leadResource = LeadResource.resource;
        this.workflowService = WorkflowService;
        this.customerService = CustomerService;
        this.productService = ProductService;
        this.sourceService = SourceService;
        this.processService = ProcessService;
    }

    setRow(id: number, row: any) {
        this.rows[id] = row;
    }

    updateRow(process: Process, dtInstance: any, scope: any) {
        dtInstance.DataTable.row(this.rows[process.id]).data(process).draw(
            false);

        this.compile(angular.element(this.rows[process.id]).contents())(scope);
    }

    removeOrUpdateRow(process: Process, loadAllData: boolean, dtInstance: any, scope: any) {
        if (loadAllData === true) {
            this.updateRow(process, dtInstance, scope);
        } else if (loadAllData === false) {
            dtInstance.DataTable.row(this.rows[process.id]).remove()
                .draw();
        }
    }
    deleteRow(process: Process, dtInstance: any): void {
        let self = this;
        this.processService.delete(process).then((data) => {
            self.toaster.pop("success", "", self.translate
                .instant("COMMON_TOAST_SUCCESS_DELETE_LEAD"));
            self.rootScope.leadsCount -= 1;
            dtInstance.DataTable.row(self.rows[process.id]).remove().draw();
            self.rootScope.$broadcast("onTodosChange");
        }, (error) => {
            self.toaster.pop("error", "", self.translate
                .instant("COMMON_TOAST_FAILURE_DELETE_LEAD"));
        });
    }
}

angular.module(moduleLeadService, [ngResourceId]).service(LeadServiceId, LeadService);
*/