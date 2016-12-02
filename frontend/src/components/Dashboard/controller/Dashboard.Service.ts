/// <reference path="../../app/App.Constants.ts" />
/// <reference path="../../app/App.Resource.ts" />
/// <reference path="../../lead/model/Lead.Model.ts" />
/// <reference path="../../offer/model/Offer.Model.ts" />
/// <reference path="../../sale/model/Sale.Model.ts" />
/// <reference path="../../common/service/Workflow.Service.ts" />
/// <reference path="../../common/model/Process.Model.ts" />
/// <reference path="../../common/model/Promise.interface.ts" />
/// <reference path="../../common/service/Workflow.Controller.ts" />


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

const DashboardServiceId: string = "DashboardService";

class DashboardService {

    private $inject = [ProcessResourceId, toasterId, $rootScopeId, $translateId, WorkflowServiceId, $uibModalId, $qId, "SweetAlert"];

    processResource: any;
    workflowService: WorkflowService;
    toaster: any;
    translate: any;
    rootScope: any;
    q: any;
    dragging: Boolean = false;
    inModal: Boolean = false;

    openLeads: Array<Process> = [];
    inContacts: Array<Process> = [];
    openOffers: Array<Process> = [];
    doneOffers: Array<Process> = [];
    closedSales: Array<Process> = [];
    elementToDelete: Array<Process> = [];
    delementDropzoneVisibility: string = "hidden";

    allOpenLeads: Array<Process> = [];
    allInContacts: Array<Process> = [];
    allOpenOffers: Array<Process> = [];
    allDoneOffers: Array<Process> = [];
    allClosedSales: Array<Process> = [];

    openLeadsValue: number = 0;
    inContactsValue: number = 0;
    openOffersValue: number = 0;
    doneOffersValue: number = 0;
    closedSalesValue: number = 0;
    SweetAlert: any;
    uibModal;
    todos: Array<Process> = [];
    dropzoneClass = {
        lead: "none",
        contact: "none",
        offer: "none",
        done: "none",
        sale: "none",
    };

    constructor(ProcessResource, toaster, $rootScope, $translate, WorkflowService, $uibModal, $q, SweetAlert) {
        this.processResource = ProcessResource.resource;
        this.workflowService = WorkflowService;
        this.toaster = toaster;
        this.rootScope = $rootScope;
        this.translate = $translate;
        this.q = $q;
        this.SweetAlert = SweetAlert;
        this.uibModal = $uibModal;
        this.refreshTodos();

        $rootScope.$on("onTodosChange", (event) => {
            this.refreshTodos();
        });

        let self = this;
        setInterval(function () {
            self.refreshTodos();
        }, 10 * 60 * 1000);
    }

    initDashboard() {
        let self = this;
        this.processResource.getWorkflowByStatus({ workflow: "LEAD", status: "OPEN" }).$promise.then(function (result) {
            let open: Array<Process> = new Array<Process>();
            let contact: Array<Process> = new Array<Process>();
            for (let i = 0; i < result.length; i++) {
                if (result[i].status === "OPEN") {
                    open.push(result[i]);
                }
                else if (result[i].status === "INCONTACT") {
                    contact.push(result[i]);
                }
            }
            self.openLeads = self.orderProcessByTimestamp(open, "lead");
            self.allOpenLeads = self.openLeads;
            self.sumLeads();
            self.inContacts = self.orderProcessByTimestamp(contact, "lead");
            self.allInContacts = self.inContacts;
            self.sumInContacts();
        });

        this.processResource.getWorkflowByStatus({ workflow: "OFFER", status: "OFFER" }).$promise.then(function (result) {
            let open: Array<Process> = new Array<Process>();
            let done: Array<Process> = new Array<Process>();
            for (let i = 0; i < result.length; i++) {
                if (result[i].status === "OFFER" || result[i].status === "FOLLOWUP") {
                    open.push(result[i]);
                }
                else if (result[i].status === "DONE") {
                    done.push(result[i]);
                }
            }
            self.openOffers = self.orderProcessByTimestamp(open, "offer");
            self.allOpenOffers = self.openOffers;
            self.sumOffers();
            self.doneOffers = self.orderProcessByTimestamp(done, "offer");
            self.allDoneOffers = self.doneOffers;
            self.sumDoneOffers();
        });

        this.processResource.getLatestSales().$promise.then(function (result) {
            self.closedSales = result;
            self.allClosedSales = self.closedSales;
            self.sumSales();
        });
    }

    sumLeads(): void {
        this.openLeadsValue = 0;
        for (let i = 0; i < this.openLeads.length; i++) {
            this.openLeadsValue += this.workflowService.sumOrderPositions(this.openLeads[i].lead.orderPositions);
        }
    }
    sumInContacts(): void {
        this.inContactsValue = 0;
        for (let i = 0; i < this.inContacts.length; i++) {
            this.inContactsValue += this.workflowService.sumOrderPositions(this.inContacts[i].lead.orderPositions);
        }
    }
    sumOffers(): void {
        this.openOffersValue = 0;
        for (let i = 0; i < this.openOffers.length; i++) {
            this.openOffersValue += this.openOffers[i].offer.netPrice;
        }
    }

    sumDoneOffers(): void {
        this.doneOffersValue = 0;
        for (let i = 0; i < this.doneOffers.length; i++) {
            this.doneOffersValue += this.doneOffers[i].offer.netPrice;
        }
    }

    sumSales(): void {
        this.closedSalesValue = 0;
        for (let i = 0; i < this.closedSales.length; i++) {
            this.closedSalesValue += this.closedSales[i].sale.saleTurnover;
        }
    }

    setSortableOptions(scope: any): any {
        let self: DashboardService = this;
        let sortableList = {
            start: function (e, ui) {
                let source = ui.item.sortable.sourceModel;
                self.delementDropzoneVisibility = "show";
                self.dragging = true;
                if (source === self.openLeads) {
                    self.dropzoneClass.contact = "2px dashed grey";
                    self.dropzoneClass.offer = "2px dashed grey";
                }
                else if (source === self.inContacts) {
                    self.dropzoneClass.offer = "2px dashed grey";
                }
                else if (source === self.openOffers) {
                    self.dropzoneClass.done = "2px dashed grey";
                    self.dropzoneClass.sale = "2px dashed grey";
                }
                else if (source === self.doneOffers) {
                    self.dropzoneClass.offer = "2px dashed grey";
                    self.dropzoneClass.sale = "2px dashed grey";
                }
                else if (source === self.closedSales) {
                    self.dropzoneClass.sale = "2px dashed grey";
                }
                scope.$apply();
            },
            update: function (e, ui) {
                let target = ui.item.sortable.droptargetModel;
                let source = ui.item.sortable.sourceModel;
                let item = ui.item.sortable.model;
                if ((self.openLeads === target && self.openOffers === source) ||
                    (self.openLeads === target && self.inContacts === source) ||
                    (self.openLeads === target && self.doneOffers === source) ||
                    (self.inContacts === target && self.openOffers === source) ||
                    (self.inContacts === target && self.doneOffers === source) ||
                    (self.inContacts === target && self.closedSales === source) ||
                    (self.doneOffers === target && self.openLeads === source) ||
                    (self.doneOffers === target && self.inContacts === source) ||
                    (self.closedSales === target && self.inContacts === source) ||
                    (self.closedSales === target && self.openLeads === source) ||
                    target === source) {

                    ui.item.sortable.cancel();
                }
            },
            stop: function (e, ui) {
                let target = ui.item.sortable.droptargetModel;
                let source = ui.item.sortable.sourceModel;
                let item = ui.item.sortable.model;

                self.delementDropzoneVisibility = "hidden";
                self.dragging = false;
                self.dropzoneClass.lead = "none";
                self.dropzoneClass.contact = "none";
                self.dropzoneClass.offer = "none";
                self.dropzoneClass.done = "none";
                self.dropzoneClass.sale = "none";

                if (self.closedSales === target && self.openOffers === source
                    || self.closedSales === target && self.doneOffers === source) {
                    self.inModal = true;
                    self.startSaleTransformation(item).then(function (result: Process) {
                        if (result === undefined) {
                            item.sale = undefined;
                            target.splice(target.indexOf(item), 1);
                            source.push(item);
                            self.inModal = false;
                        } else {
                            let index = target.indexOf(item);
                            target[index] = result;
                            self.removeFromSourceAndAddToTarget(self.allClosedSales, self.allOpenOffers, item, result);
                            self.removeFromSourceAndAddToTarget(self.allClosedSales, self.allDoneOffers, item, result);
                            self.inModal = false;
                        }
                        self.updateDashboard("sale");
                    }, function (result) {
                        item.sale = undefined;
                        target.splice(target.indexOf(item), 1);
                        source.push(item);
                        self.inModal = false;
                        self.updateDashboard("sale");
                    });
                }
                else if (self.openOffers === target && self.openLeads === source
                    || self.openOffers === target && self.inContacts === source) {
                    self.inModal = true;
                    self.startOfferTransformation(item).then(function (result: Process) {
                        if (result === undefined) {
                            item.offer = undefined;
                            target.splice(target.indexOf(item), 1);
                            source.push(item);
                            self.inModal = false;
                        } else {
                            let index = target.indexOf(item);
                            target[index] = result;
                            self.removeFromSourceAndAddToTarget(self.allOpenOffers, self.allOpenLeads, item, result);
                            self.removeFromSourceAndAddToTarget(self.allOpenOffers, self.allInContacts, item, result);
                            self.inModal = false;
                        }
                        self.updateDashboard("offer");
                    }, function (result) {
                        item.offer = undefined;
                        target.splice(target.indexOf(item), 1);
                        source.push(item);
                        self.inModal = false;
                        self.updateDashboard("offer");
                    });
                }
                else if (self.inContacts === target && self.openLeads === source) {
                    self.inContact(item);
                    item.processor = self.rootScope.user;
                    self.removeFromSourceAndAddToTarget(self.allInContacts, self.allOpenLeads, item, item);
                    self.updateDashboard("lead");
                }
                else if (self.doneOffers === target && self.openOffers === source) {
                    self.doneOffer(item);
                    item.processor = null;
                    self.removeFromSourceAndAddToTarget(self.allDoneOffers, self.allOpenOffers, item, item);
                    self.updateDashboard("offer");
                }
                else if (self.openOffers === target && self.doneOffers === source) {
                    self.doneOffer(item);
                    item.processor = self.rootScope.user;
                    self.removeFromSourceAndAddToTarget(self.allOpenOffers, self.allDoneOffers, item, item);
                    self.updateDashboard("offer");
                }
                else if (target === self.elementToDelete) {
                    let title = "";
                    let text = "";
                    if (source === self.openLeads || source === self.inContacts) {
                        title = self.translate.instant("LEAD_CLOSE_LEAD");
                        text = self.translate.instant("LEAD_CLOSE_LEAD_REALLY");
                    } else if (source === self.openOffers || source === self.doneOffers) {
                        title = self.translate.instant("OFFER_CLOSE_OFFER");
                        text = self.translate.instant("OFFER_CLOSE_OFFER_REALLY");
                    }
                    self.inModal = true;
                    self.SweetAlert.swal({
                        title: title,
                        text: text,
                        type: "warning",
                        showCancelButton: true,
                        cancelButtonText: self.translate.instant("NO"),
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: self.translate.instant("YES"),
                    }, function (isConfirm) {
                        if (isConfirm) {
                            self.closeProcess(item, source);
                            target.splice(source.indexOf(item), 1);
                            self.sliceElementFromArray(self.allOpenLeads, item);
                            self.sliceElementFromArray(self.allInContacts, item);
                            self.sliceElementFromArray(self.allOpenOffers, item);
                            self.sliceElementFromArray(self.allDoneOffers, item);
                            let todoElement: Process = findElementById(self.todos, item.id) as Process;
                            if (!isNullOrUndefined(todoElement)) {
                                self.todos.splice(self.todos.indexOf(todoElement), 1);
                                self.rootScope.$broadcast("todosChanged", self.todos);
                            }
                            self.inModal = false;
                        }
                        else {
                            target.splice(target.indexOf(item), 1);
                            source.push(item);
                            self.inModal = false;
                        }
                    });
                }
            },
            connectWith: ".connectList",
            items: "li:not(.not-sortable)"
        };
        return sortableList;
    }

    removeFromSourceAndAddToTarget(target: Array<Process>, source: Array<Process>, item: Process, replaceItem) {
        if (source.indexOf(item) > -1) {
            target.push(replaceItem);
            source.splice(source.indexOf(item), 1);
        }
    }

    sliceElementFromArray(arr: Array<Process>, item: Process) {
        if (arr.indexOf(item) > -1) {
            arr.splice(arr.indexOf(item), 1);
        }
    }

    updateDashboard(type: string) {
        if (type === "lead") {
            this.openLeads = this.orderProcessByTimestamp(this.openLeads, "lead");
            this.inContacts = this.orderProcessByTimestamp(this.inContacts, "lead");
            this.sumLeads();
            this.sumInContacts();
        }
        else if (type === "offer") {
            this.openOffers = this.orderProcessByTimestamp(this.openOffers, "offer");
            this.doneOffers = this.orderProcessByTimestamp(this.doneOffers, "offer");
            this.openLeads = this.orderProcessByTimestamp(this.openLeads, "lead");
            this.inContacts = this.orderProcessByTimestamp(this.inContacts, "lead");
            this.sumLeads();
            this.sumInContacts();
            this.sumDoneOffers();
            this.sumOffers();
        } else if (type === "sale") {
            this.closedSales = this.orderProcessByTimestamp(this.closedSales, "sale").reverse();
            this.doneOffers = this.orderProcessByTimestamp(this.doneOffers, "offer");
            this.openOffers = this.orderProcessByTimestamp(this.openOffers, "offer");
            this.sumOffers();
            this.sumDoneOffers();
            this.sumSales();
        }
    }

    startOfferTransformation(process: Process): IPromise<Process> {
        let defer: IDefer<Process> = this.q.defer();
        this.workflowService.startOfferTransformation(process).then(function (result: Process) {
            defer.resolve(result);
        }, function (error) {
            defer.reject(error);
        });
        return defer.promise;
    }

    startSaleTransformation(process: Process): IPromise<Process> {
        let defer = this.q.defer();
        this.workflowService.startSaleTransformation(process).then(function (result) {
            defer.resolve(result);
        }, function () {
            defer.reject(undefined);
        });
        return defer.promise;
    }

    inContact(process: Process) {
        this.workflowService.inContact(process);
    }

    doneOffer(process: Process) {
        this.workflowService.doneOffer(process);
    }

    closeProcess(process: Process, source: any) {
        let self = this;
        this.processResource.setStatus({
            id: process.id
        }, "CLOSED").$promise.then(function () {
            let message = "";
            if (source === self.openLeads) {
                self.sumLeads();
                self.rootScope.leadsCount -= 1;
                message = self.translate.instant("COMMON_TOAST_SUCCESS_CLOSE_LEAD");
            }
            else if (source === self.inContacts) {
                self.rootScope.leadsCount -= 1;
                self.sumInContacts();
                message = self.translate.instant("COMMON_TOAST_SUCCESS_CLOSE_LEAD");
            }
            else if (source === self.openOffers) {
                self.rootScope.offersCount -= 1;
                self.sumOffers();
                message = self.translate.instant("COMMON_TOAST_SUCCESS_CLOSE_OFFER");
            }
            else if (source === self.doneOffers) {
                self.rootScope.offersCount -= 1;
                self.sumDoneOffers();
                message = self.translate.instant("COMMON_TOAST_SUCCESS_CLOSE_OFFER");
            }
            self.toaster.pop("success", "", message);
            process.status = "CLOSED";
        });
    }

    getOpenLeads(): Array<Process> {
        return this.openLeads;
    }
    getInContacts(): Array<Process> {
        return this.inContacts;
    }
    getOpenOffers(): Array<Process> {
        return this.openOffers;
    }
    getDoneOffers(): Array<Process> {
        return this.doneOffers;
    }

    getClosedSales(): Array<Process> {
        return this.closedSales;
    }

    filterMytasks(showMytasks: boolean) {
        let self = this;
        if (showMytasks) {
            this.openLeads = this.openLeads.filter(process => !isNullOrUndefined(process.processor) && process.processor.id === self.rootScope.user.id);
            this.inContacts = this.inContacts.filter(process => !isNullOrUndefined(process.processor) && process.processor.id === self.rootScope.user.id);
            this.openOffers = this.openOffers.filter(process => !isNullOrUndefined(process.processor) && process.processor.id === self.rootScope.user.id);
            this.doneOffers = this.doneOffers.filter(process => !isNullOrUndefined(process.processor) && process.processor.id === self.rootScope.user.id);
            this.closedSales = this.closedSales.filter(process => !isNullOrUndefined(process.processor) && process.processor.id === self.rootScope.user.id);
        } else {
            this.openLeads = this.allOpenLeads;
            this.inContacts = this.allInContacts;
            this.openOffers = this.allOpenOffers;
            this.doneOffers = this.allDoneOffers;
            this.closedSales = this.allClosedSales;
        }
        this.updateDashboard("lead");
        this.updateDashboard("offer");
        this.updateDashboard("sale");
    }

    filterBySearch(searchText: string, showMyTasks: boolean) {
        let self = this;
        if (!stringIsNullorEmpty(searchText)) {
            this.openLeads = this.allOpenLeads.filter(process => (!isNullOrUndefined(process.lead.customer.firstname) && process.lead.customer.firstname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.lead.customer.lastname) && process.lead.customer.lastname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.lead.customer.company) && process.lead.customer.company.toLowerCase().includes(searchText.toLowerCase())));
            this.inContacts = this.allInContacts.filter(process => (!isNullOrUndefined(process.lead.customer.firstname) && process.lead.customer.firstname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.lead.customer.lastname) && process.lead.customer.lastname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.lead.customer.company) && process.lead.customer.company.toLowerCase().includes(searchText.toLowerCase())));
            this.openOffers = this.allOpenOffers.filter(process => (!isNullOrUndefined(process.offer.customer.firstname) && process.offer.customer.firstname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.offer.customer.lastname) && process.offer.customer.lastname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.offer.customer.company) && process.offer.customer.company.toLowerCase().includes(searchText.toLowerCase())));
            this.doneOffers = this.allDoneOffers.filter(process => (!isNullOrUndefined(process.offer.customer.firstname) && process.offer.customer.firstname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.offer.customer.lastname) && process.offer.customer.lastname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.offer.customer.company) && process.offer.customer.company.toLowerCase().includes(searchText.toLowerCase())));
            this.closedSales = this.allClosedSales.filter(process => (!isNullOrUndefined(process.sale.customer.firstname) && process.sale.customer.firstname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.sale.customer.lastname) && process.sale.customer.lastname.toLowerCase().includes(searchText.toLowerCase()))
                || (!isNullOrUndefined(process.sale.customer.company) && process.sale.customer.company.toLowerCase().includes(searchText.toLowerCase())));
        } else {
            this.openLeads = this.allOpenLeads;
            this.inContacts = this.allInContacts;
            this.openOffers = this.allOpenOffers;
            this.doneOffers = this.allDoneOffers;
            this.closedSales = this.allClosedSales;
        }

        if (showMyTasks) {
            self.filterMytasks(showMyTasks);
        }

        this.updateDashboard("lead");
        this.updateDashboard("offer");
        this.updateDashboard("sale");
    }

    refreshTodos(): void {
        if (isNullOrUndefined(this.rootScope.user)) {
            return;
        }
        this.processResource.getTodos({ processorId: this.rootScope.user.id }).$promise.then((data) => {
            this.todos = this.orderByTimestamp(data);
            this.rootScope.$broadcast("todosChanged", this.todos);
        }, (error) => handleError(error));

    }

    orderByTimestamp(todos: Array<Process>): Array<Process> {
        return todos.sort((a, b) => {
            let tempA = isNullOrUndefined(a.offer) ? moment(a.lead.timestamp, "DD.MM.YYYY HH:mm:ss") : moment(a.offer.timestamp, "DD.MM.YYYY HH:mm:ss");
            let tempB = isNullOrUndefined(b.offer) ? moment(b.lead.timestamp, "DD.MM.YYYY HH:mm:ss") : moment(b.offer.timestamp, "DD.MM.YYYY HH:mm:ss");
            if (tempA < tempB) { return -1; }
            else if (tempA > tempB) { return 1; }
            else { return 0; }
        });
    }

    orderProcessByTimestamp(process: Array<Process>, type: string): Array<Process> {
        if (type === "lead") {
            return process.sort((a, b) => {
                let tempA = moment(a.lead.timestamp, "DD.MM.YYYY HH:mm:ss");
                let tempB = moment(b.lead.timestamp, "DD.MM.YYYY HH:mm:ss");
                if (tempA < tempB) { return -1; }
                else if (tempA > tempB) { return 1; }
                else { return 0; }
            });
        } else if (type === "offer") {
            return process.sort((a, b) => {
                let tempA = moment(a.offer.timestamp, "DD.MM.YYYY HH:mm:ss");
                let tempB = moment(b.offer.timestamp, "DD.MM.YYYY HH:mm:ss");
                if (tempA < tempB) { return -1; }
                else if (tempA > tempB) { return 1; }
                else { return 0; }
            });
        } else if (type === "sale") {
            return process.sort((a, b) => {
                let tempA = moment(a.sale.timestamp, "DD.MM.YYYY HH:mm:ss");
                let tempB = moment(b.sale.timestamp, "DD.MM.YYYY HH:mm:ss");
                if (tempA < tempB) { return -1; }
                else if (tempA > tempB) { return 1; }
                else { return 0; }
            });
        }
    }
}
angular.module(moduleDashboardService, [ngResourceId]).service(DashboardServiceId, DashboardService);