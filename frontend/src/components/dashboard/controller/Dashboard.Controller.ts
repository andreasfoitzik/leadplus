/// <reference path="../../app/App.Constants.ts" />
/// <reference path="../../app/App.Resource.ts" />
/// <reference path="../../common/service/Workflow.Service.ts" />
/// <reference path="../../statistic/controller/Statistic.Service.ts" />
/// <reference path="../../dashboard/controller/Dashboard.Service.ts" />
/// <reference path="../../common/model/Process.Model.ts" />
/// <reference path="../../common/model/Commentary.Model.ts" />
/// <reference path="../../common/model/IWorkflow.Interface.ts" />
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

const DashboardControllerId: string = "DashboardController";

class DashboardController {

    $inject = [WorkflowServiceId, StatisticServiceId, DashboardServiceId];

    workflowService: WorkflowService;
    statisticService: StatisticService;
    dashboardService: DashboardService;
    commentModalInput: string;
    workflowModalData: IWorkflow;
    workflowModalType: string;
    workflowModalProcess: Process;
    workflowComments: Array<Commentary>;
    sortableOptions: any;
    todos: Array<Process> = [];

    constructor(WorkflowService, StatisticService, DashboardService) {
        this.workflowService = WorkflowService;
        this.statisticService = StatisticService;
        this.dashboardService = DashboardService;
        this.statisticService.loadAllResourcesByDateRange("WEEKLY");
        this.sortableOptions = this.dashboardService.setSortableOptions();
        this.refreshData();
        this.dashboardService.getTodos(2).$promise.then((processes) => this.todos = processes);
    }

    createOffer(process: Process) {
        this.dashboardService.createOffer(process);
    }

    createSale(process: Process) {
        this.dashboardService.createSale(process);
    }

    saveDataToModal(info, type, process) {
        this.workflowModalData = info;
        this.workflowModalType = type;
        this.workflowModalProcess = process;
        this.workflowComments = this.workflowService.getCommentsByProcessId(process.id);
    }

    refreshData() {
        this.dashboardService.initDashboard();
    }

    addComment(process) {
        let self: DashboardController = this;
        this.workflowService.addComment(this.workflowComments, process, this.commentModalInput).then(function () {
            self.commentModalInput = "";
        });
    }

    getOpenLeads(): Array<Lead> {
        return this.dashboardService.getOpenLeads();
    }
    getOpenOffers(): Array<Offer> {
        return this.dashboardService.getOpenOffers();
    }
    getClosedSales(): Array<Sale> {
        return this.dashboardService.getClosedSales();
    }
    getProfit(): number {
        return this.statisticService.getProfitTotal();
    }
    getTurnover(): number {
        return this.statisticService.getTurnoverTotal();
    }
    getLeadAmount(): number {
        return this.statisticService.getLeadAmount();
    }
    getOfferAmount(): number {
        return this.statisticService.getOfferAmount();
    }
    getSaleAmount(): number {
        return this.statisticService.getSaleAmount();
    }
    getConversionrate(): number {
        return this.statisticService.getLeadConversionRate();
    }
}

angular.module(moduleDashboard, [ngResourceId]).controller(DashboardControllerId, DashboardController);