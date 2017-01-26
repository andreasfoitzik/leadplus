/// <reference path="../../app/App.Constants.ts" />
/// <reference path="../../Common/directive/Directive.Interface.ts" />
/// <reference path="../../Workflow/controller/Workflow.Service.ts" />

const SaleEditDirectiveId: string = "saleEdit";

class SaleEditDirective implements IDirective {
    templateUrl = () => { return "components/Modal/view/Edit.Sale.html"; };
    transclude = false;
    restrict = "E";
    scope = {
        form: "=",
        editWorkflowUnit: "=",
        editProcess: "=",
        editable: "<"
    };

    constructor(private WorkflowService: WorkflowService, private $rootScope) {
    }

    static directiveFactory(): SaleEditDirective {
        let directive: any = (WorkflowService: WorkflowService, $rootScope) => new SaleEditDirective(WorkflowService, $rootScope);
        directive.$inject = [WorkflowServiceId, $rootScopeId];
        return directive;
    }

    link(scope, element, attrs, ctrl, transclude): void {
        scope.workflowService = this.WorkflowService;
        scope.rootScope = this.$rootScope;
        if (!isNullOrUndefined(scope.form)) {
            scope.form instanceof WizardButtonConfig ? scope.form.setForm(scope.sform) : scope.sform = scope.form;
        }
        scope.invoiceNumberAlreadyExists = false;


        scope.existsInvoiceNumber = () => this.existsInvoiceNumber(scope);
        scope.calculateProfit = () => this.calculateProfit(scope);
    };

    async existsInvoiceNumber(scope: any) {
        if (!isNullOrUndefined(scope.editWorkflowUnit.invoiceNumber) && scope.editWorkflowUnit.invoiceNumber.length > 0) {
            let sale = await scope.workflowService.getSaleByInvoiceNumber(scope.editWorkflowUnit.invoiceNumber).catch(error => handleError(error));
            scope.invoiceNumberAlreadyExists = !isNullOrUndefined(sale.invoiceNumber);
            scope.$apply();
        }
    }

    calculateProfit(scope: any) {
        if (!isNullOrUndefined(scope.editWorkflowUnit.saleTurnover) && !isNullOrUndefined(scope.editWorkflowUnit.saleCost)) {
            scope.editWorkflowUnit.saleProfit = scope.editWorkflowUnit.saleTurnover - scope.editWorkflowUnit.saleCost;
        }
    }
}
angular.module(moduleApp).directive(SaleEditDirectiveId, SaleEditDirective.directiveFactory());