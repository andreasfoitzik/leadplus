/// <reference path="../../../typeDefinitions/moment.d.ts" />
/// <reference path="../../../typeDefinitions/moment-node.d.ts" />
/// <reference path="../../app/App.Common.ts" />
/// <reference path="../../app/App.Constants.ts" />
/// <reference path="../../Common/model/OrderPosition.Model.ts" />
/// <reference path="../../Product/model/Product.Model.ts" />
/// <reference path="../../common/model/Process.Model.ts" />
/// <reference path="../../Lead/model/Lead.Model.ts" />
/// <reference path="../../Lead/controller/Lead.DataTableService.ts" />
/// <reference path="../../Lead/controller/Lead.Service.ts" />
/// <reference path="../../User/model/User.Model.ts" />
/// <reference path="../../common/service/Workflow.Service.ts" />
/// <reference path="../../common/service/AbstractWorkflow.ts" />
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

const LeadControllerId: string = "LeadController";

class LeadController extends AbstractWorkflow {

    $inject = [$rootScopeId, $compileId, $scopeId, WorkflowServiceId, LeadDataTableServiceId, LeadServiceId, $routeParamsId, $sceId];

    type: string = "lead";

    uibModalInstance;

    workflowService: WorkflowService;
    leadDataTableService: LeadDataTableService;
    leadService: LeadService;
    scope;
    compile;
    dtOptions;
    dtColumns;
    dtInstance: any = { DataTable: null };

    commentInput: string;
    commentModalInput: string;
    loadAllData: boolean = false;
    processes: { [key: number]: Process } = {};
    editProcess: Process;
    editWorkflowUnit: Lead = new Lead();
    edit: boolean;
    editable: boolean = true;

    currentOrderPositions: Array<OrderPosition>;
    currentProductId = "-1";
    currentProductAmount = 1;
    currentCustomerId = "-1";
    customerSelected: boolean = false;

    customerEditForm: any;
    leadEditForm: any;
    supplyEditForm: any;
    priceEditForm: any;
    emailEditForm: any;
    saleEditForm: any;

    constructor($rootScope, $compile, $scope, WorkflowService, LeadDataTableService, LeadService, $routeParams, $sce) {
        super(WorkflowService, $sce);
        this.workflowService = WorkflowService;
        this.leadDataTableService = LeadDataTableService;
        this.leadService = LeadService;
        this.scope = $scope;
        this.compile = $compile;
        this.currentWizard = 1;

        let self = this;
        $rootScope.$on("deleteRow", (event, data) => {
            self.leadService.removeOrUpdateRow(data, self.loadAllData, self.dtInstance, self.scope);
        });

        function createdRow(row, data: Process, dataIndex) {
            self.leadService.setRow(data.id, row);
            self.leadDataTableService.configRow(row, data);
            self.compile(angular.element(row).contents())(self.scope);
        }
        function addActionsButtons(data: Process, type, full, meta) {
            return self.leadDataTableService.getActionButtonsHTML(data, self.templateData);
        }
        function addStatusStyle(data: Process, type, full, meta) {
            self.processes[data.id] = data;
            return self.leadDataTableService.getStatusStyleHTML(data);
        }
        function addDetailButton(data: Process, type, full, meta) {
            self.processes[data.id] = data;
            return self.leadDataTableService.getDetailHTML(data.id);
        }

        let searchLink = "";
        let processId = $routeParams.processId;
        if (!isNullOrUndefined(processId) && processId !== "") {
            searchLink = "#id:" + processId + "#";
            let intervall = setInterval(function () {
                if (!isNullOrUndefined(angular.element("#id_" + processId)) && !isNullOrUndefined(self.processes[processId])) {
                    self.appendChildRow(self.processes[processId]);
                    clearInterval(intervall);
                }
            }, 100);

            setTimeout(function () {
                clearInterval(intervall);
            }, 10000);
        }
        this.dtOptions = this.leadDataTableService.getDTOptionsConfiguration(createdRow, searchLink);
        this.dtColumns = this.leadDataTableService.getDTColumnConfiguration(addDetailButton, addStatusStyle, addActionsButtons);
    }

    close() {
        this.clearNewLead();
        this.uibModalInstance.close();
    }

    changeDataInput() {
        this.workflowService.changeDataInput(this.loadAllData, this.dtOptions, allDataLeadRoute, openDataLeadRoute);
    }

    refreshData() {
        let resetPaging = false;
        this.dtInstance.reloadData(resetPaging);
    }

    appendChildRow(process: Process) {
        let childScope = this.scope.$new(true);
        this.workflowService.appendChildRow(childScope, process, process.lead, this.dtInstance, this, "lead");
    }

    loadDataToModal(process: Process) {
        if (!isNullOrUndefined(this.customerEditForm)) {
            this.customerEditForm.$setPristine();
        }
        if (!isNullOrUndefined(this.leadEditForm)) {
            this.leadEditForm.$setPristine();
        }
        if (!isNullOrUndefined(this.supplyEditForm)) {
            this.supplyEditForm.$setPristine();
        }
        if (!isNullOrUndefined(this.priceEditForm)) {
            this.priceEditForm.$setPristine();
        }
        if (!isNullOrUndefined(this.emailEditForm)) {
            this.emailEditForm.$setPristine();
        }
        if (!isNullOrUndefined(this.saleEditForm)) {
            this.saleEditForm.$setPristine();
        }

        this.edit = true;
        this.currentProductId = "-1";
        this.currentProductAmount = 1;
        this.editProcess = process;
        this.currentOrderPositions = deepCopy(this.editProcess.lead.orderPositions);
        this.customerSelected = this.editProcess.lead.customer.id > 0;
        this.currentCustomerId = this.editProcess.lead.customer.id + "";
        this.editWorkflowUnit = deepCopy(this.editProcess.lead);
    }

    addComment(id: number, input: string) {
        this.workflowService.addComment(this.processes[id], input[id]).then(function () {
            input[id] = "";
        });
    }

    inContact(process: Process) {
        this.leadService.inContact(process, this.dtInstance, this.scope);
    }

    save(edit: boolean) {
        if (edit === true) {
            this.leadService.saveEditedRow(this.editWorkflowUnit, this.editProcess, this.currentOrderPositions, this.dtInstance, this.scope);
        }
        else {
            this.leadService.saveLead(this.dtInstance, this.editWorkflowUnit, this.currentOrderPositions);
        }
    }

    clearNewLead() {
        // this.editForm.$setPristine();
        this.edit = false;
        this.editWorkflowUnit = new Lead();
        this.editProcess = new Process();
        this.editWorkflowUnit.orderPositions = new Array<OrderPosition>();
        this.currentOrderPositions = new Array<OrderPosition>();
        this.currentProductId = "-1";
        this.currentCustomerId = "-1";
        this.currentProductAmount = 1;
        this.customerSelected = false;
    }

    createNextWorkflowUnit(process: Process) {
        // this.leadService.createOffer(process, this.loadAllData, this.dtInstance, this.scope);
        this.workflowService.startOfferTransformation(process);
    }

    pin(process: Process, user: User) {
        this.leadService.pin(process, this.dtInstance, this.scope, user);
    }

    closeOrOpen(process: Process) {
        this.leadService.closeOrOpenInquiry(process, this.dtInstance, this.scope, this.loadAllData);
    }

    deleteRow(process: Process) {
        this.leadService.deleteRow(process, this.dtInstance);
    }

    selectCustomer(workflow: any) {
        this.customerSelected = this.workflowService.selectCustomer(workflow, this.currentCustomerId);
    }

    preventPropagation($event) {
        $event.stopPropagation();
    }

    getOrderPositions(process: Process): Array<OrderPosition> {
        if (!isNullOrUndefined(process.lead)) {
            return process.lead.orderPositions;
        }
    }

    getTemplateData(processId: number): any {
        return this.templateData[processId];
    }

}
angular.module(moduleLead, [ngResourceId]).controller(LeadControllerId, LeadController);




