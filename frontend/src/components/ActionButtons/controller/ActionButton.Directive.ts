/// <reference path="../../app/App.Constants.ts" />
/// <reference path="../../Workflow/controller/Workflow.Service.ts" />
/// <reference path="../../Workflow/controller/Workflow.Modal.Service.ts" />
/// <reference path="../../Common/directive/Directive.Interface.ts" />
/// <reference path="../../../typeDefinitions/angular.d.ts" />

const ActionButtonDirectiveId: string = "actionbuttons";

class ActionButtonDirective implements IDirective {

    templateUrl = () => { return "components/ActionButtons/view/Workflow.ActionButtons.html"; };
    transclude = false;
    restrict = "A";
    scope = {
        actionbuttonconfig: "=",
        process: "=",
        minwidth: "@"
    };

    constructor(private WorkflowService: WorkflowService, private $rootScope) { }

    static directiveFactory(): ActionButtonDirective {
        let directive: any = (WorkflowService: WorkflowService, $rootScope) => new ActionButtonDirective(WorkflowService, $rootScope);
        directive.$inject = [WorkflowServiceId, $rootScopeId];
        return directive;
    }

    link(scope, element, attrs, ctrl, transclude): void {
        scope.minwidth = isNullOrUndefined(scope.minwidth) ? 210 : scope.minwidth;
        scope.workflowService = this.WorkflowService;
        scope.rootScope = this.$rootScope;
        scope.config = scope.actionbuttonconfig;
        scope.ConfirmationFunctionType = ConfirmationFunctionType;
        scope.openEditModal = (process: Process): void => {
            this.$rootScope.$broadcast(broadcastOpenEditModal, process);
        };
    };
}

angular.module(moduleApp).directive(ActionButtonDirectiveId, ActionButtonDirective.directiveFactory());
