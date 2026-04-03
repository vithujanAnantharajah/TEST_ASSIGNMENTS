"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var xont_ventura_services_1 = require("xont-ventura-services");
var common_1 = require("@angular/common");
var returntype_service_1 = require("../returntype.service");
var ListComponent = /** @class */ (function () {
    function ListComponent(http, location, commanService, returnTypeService, router, datetimeService) {
        var _this = this;
        this.http = http;
        this.location = location;
        this.commanService = commanService;
        this.returnTypeService = returnTypeService;
        this.router = router;
        this.datetimeService = datetimeService;
        this.returnType = [];
        this.selectionCriteria = {
            ModuleCode: '',
            ModuleCodeDesc: '',
            RetnType: '',
            Description: '',
            Status: true,
            FirstRow: 0,
            LastRow: 0,
            Collapsed: true
        };
        this.loadingButton = {
            CurrentPage: 0, TotalPage: 0
        };
        ////////////////Datatable////////////////////
        this.rowsOnPage = 10;
        this.sortBy = "ReturnType";
        this.sortOrder = "asc";
        this.returnTypeService.componentMethodCalled$
            .subscribe(function (error) {
            _this.msgPrompt.show(error, 'SOMNT24');
        });
    }
    //v3002	remove
    //ngOnInit(): void {
    //    if (localStorage.getItem('SOMNT24_SelectionCriteria') != null) {
    //        this.selectionCriteria = JSON.parse(localStorage.getItem('SOMNT24_SelectionCriteria'));
    //    }
    //    this.loadView();
    //}
    //v3002 add
    ListComponent.prototype.ngAfterViewInit = function () {
        var storedCriteria = localStorage.getItem('SOMNT24_SelectionCriteria');
        console.log('Stored Criteria:', storedCriteria);
        if (storedCriteria) {
            try {
                var parsedCriteria = JSON.parse(storedCriteria);
                console.log('Parsed Criteria:', parsedCriteria);
                if (!parsedCriteria) {
                    throw new Error('Parsed selection criteria is null');
                }
                this.selectionCriteria = parsedCriteria;
            }
            catch (e) {
                console.warn('Failed to parse stored selection criteria.');
                localStorage.removeItem('SOMNT24_SelectionCriteria');
                this.setDefaultSelectionCriteria();
            }
        }
        else {
            this.setDefaultSelectionCriteria();
        }
        // Load the initial view AFTER ViewChild references are ready
        this.loadView();
    }; //v3002 add
    //v3002	add
    ListComponent.prototype.setDefaultSelectionCriteria = function () {
        this.selectionCriteria = {
            ModuleCode: '',
            ModuleCodeDesc: '',
            RetnType: '',
            Description: '',
            Status: true,
            FirstRow: 0,
            LastRow: 0,
            Collapsed: true
        };
    }; //v3002 ADD
    ListComponent.prototype.loadView = function () {
        this.list(true);
    };
    ListComponent.prototype.showError = function (err) {
        this.msgPrompt.show(err.json(), 'SOMNT24');
    };
    //Select Module Prompt
    ListComponent.prototype.lpmtModule_DataBind = function () {
        this.lpmtModule.dataSourceObservable = this.returnTypeService.GetModulePromptData();
    };
    ListComponent.prototype.list = function (isInit) {
        var _this = this;
        this.gridLoader.init('SOMNT24');
        this.rowsOnPage = this.gridLoader.getPageSize();
        if (isInit) {
            this.gridLoader.setCurrentPage(1);
            this.selectionCriteria.FirstRow = 1;
            this.selectionCriteria.LastRow = this.gridLoader.getLoadSize();
        }
        else {
            this.selectionCriteria.FirstRow = this.gridLoader.getRowStart();
            this.selectionCriteria.LastRow = this.gridLoader.getRowEnd();
        }
        localStorage.setItem('SOMNT24_SelectionCriteria', JSON.stringify(this.selectionCriteria));
        this.busy = this.returnTypeService.ListReturnTypeData(this.selectionCriteria)
            .subscribe(function (jsonData) {
            //console.log('hey are you working Order .?', jsonData);
            _this.returnType = jsonData[0];
            _this.gridLoader.setRowCount(jsonData[1]);
        }, function (err) {
            _this.showError(err);
        });
    };
    ListComponent.prototype.btnNewBased_onClick = function (item) {
        this.router.navigateByUrl('new/newBasedOn/' + item.ReturnType + '/' + item.ModuleCode);
    };
    ListComponent.prototype.btnEdit_onClick = function (item) {
        this.router.navigateByUrl('new/edit/' + item.ReturnType + '/' + item.ModuleCode);
    };
    ListComponent.prototype.newClick = function () {
        this.router.navigateByUrl('new/new');
    };
    ListComponent.prototype.gridLoader_OnChange = function (data) {
        this.list(false);
    };
    __decorate([
        core_1.ViewChild('gridLoader'),
        __metadata("design:type", Object)
    ], ListComponent.prototype, "gridLoader", void 0);
    __decorate([
        core_1.ViewChild('msgPrompt'),
        __metadata("design:type", Object)
    ], ListComponent.prototype, "msgPrompt", void 0);
    __decorate([
        core_1.ViewChild('lpmtModule'),
        __metadata("design:type", Object)
    ], ListComponent.prototype, "lpmtModule", void 0);
    ListComponent = __decorate([
        core_1.Component({
            selector: 'my-list',
            templateUrl: './app/list.component/list.component.html',
            providers: [returntype_service_1.ReturnTypeService]
        }),
        __metadata("design:paramtypes", [http_1.Http, common_1.Location, xont_ventura_services_1.CommonService, returntype_service_1.ReturnTypeService, router_1.Router, xont_ventura_services_1.DatetimeService])
    ], ListComponent);
    return ListComponent;
}());
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map