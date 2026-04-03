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
var returntype_service_1 = require("../returntype.service");
var NewComponent = /** @class */ (function () {
    function NewComponent(route, http, router, commonService, returnTypeService, datetimeService) {
        var _this = this;
        this.route = route;
        this.http = http;
        this.router = router;
        this.commonService = commonService;
        this.returnTypeService = returnTypeService;
        this.datetimeService = datetimeService;
        this.pageType = '';
        this.RetnType = '';
        this.ModuleCode = '';
        this.recID = -1;
        this.formData = {
            pageType: '',
            recID: -1,
            TimeStamp: '',
            ReturnType: '',
            Description: '',
            ModuleCode: '',
            ModuleCodeDesc: '',
            ReturnCategory: '',
            CategoryDesc: '',
            ReturnValueValidation: 'No',
            SalableReturn: true,
            DeductFromSales: true,
            Active: true
        };
        this.formDataProperties = {
            ReturnType: { Enable: true },
            ModuleCode: { Enable: true },
            btnModuleCode: { Enable: true },
            ModuleCodeDesc: { Enable: true }
        };
        this.ReturnTypeDataArray = [];
        this.RVVcheck = '';
        this.returnTypeService.componentMethodCalled$
            .subscribe(function (error) {
            _this.msgPrompt.show(error, 'SOMNT24');
        });
    }
    NewComponent.prototype.showError = function (err) {
        this.msgPrompt.show(err.json(), 'SOMNT24');
    };
    NewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route
            .params
            .subscribe(function (params) {
            _this.pageType = params['pageType'];
            _this.RetnType = params['retnType'];
            _this.ModuleCode = params['moduleCode'];
            _this.formData.pageType = _this.pageType;
            _this.loadView();
        });
    };
    NewComponent.prototype.loadView = function () {
        var _this = this;
        if (this.pageType == 'newBasedOn' || this.pageType == 'edit') {
            //Get selected return Type
            this.busy = this.returnTypeService.SeletedReturnType(this.ModuleCode, this.RetnType)
                .subscribe(function (returnTypeJsonData) {
                //Get Selected Data Item
                _this.ReturnTypeDataArray = returnTypeJsonData;
                //Fill common Data
                _this.formData.Description = returnTypeJsonData.Description;
                _this.formData.ReturnCategory = returnTypeJsonData.ReturnCategory;
                _this.formData.CategoryDesc = returnTypeJsonData.ReturnCategoryDesc;
                _this.formData.ModuleCode = returnTypeJsonData.ModuleCode;
                _this.formData.ModuleCodeDesc = returnTypeJsonData.ModuleCodeDesc;
                _this.formData.TimeStamp = returnTypeJsonData.TimeStamp;
                if (returnTypeJsonData.ProcessingRequired == "1") {
                    _this.formData.SalableReturn = true;
                }
                else {
                    _this.formData.SalableReturn = false;
                }
                if (returnTypeJsonData.Status == "1") {
                    _this.formData.Active = true;
                }
                else {
                    _this.formData.Active = false;
                }
                if (returnTypeJsonData.ReturnDeductionType == "0") {
                    _this.formData.DeductFromSales = false;
                }
                else {
                    _this.formData.DeductFromSales = true;
                }
                if (returnTypeJsonData.ValidateReturnValue == "0") {
                    _this.formData.ReturnValueValidation = 'No';
                    _this.RVVcheck = '0';
                }
                else if (returnTypeJsonData.ValidateReturnValue == "1") {
                    _this.formData.ReturnValueValidation = 'Mandatory';
                    _this.RVVcheck = '1';
                }
                else {
                    _this.formData.ReturnValueValidation = 'WithConfirmation';
                    _this.RVVcheck = '2';
                }
                if (_this.pageType == 'edit') {
                    //Edit
                    _this.formData.ReturnType = returnTypeJsonData.RetnType;
                    _this.formDataProperties.ReturnType.Enable = false;
                    _this.formDataProperties.ModuleCode.Enable = false;
                    _this.formDataProperties.btnModuleCode.Enable = false;
                    _this.formDataProperties.ModuleCodeDesc.Enable = false;
                }
                if (_this.pageType == 'newBasedOn') {
                    //new Based on
                    _this.formData.ReturnType = '';
                }
            }, function (errer) {
                _this.showError(errer);
            });
        }
        else {
            this.formData.ReturnValueValidation = 'No';
        }
    };
    //Select Module Prompt
    NewComponent.prototype.lpmtModule_DataBind = function () {
        this.lpmtModule.dataSourceObservable = this.returnTypeService.GetModulePromptDataForNew();
    };
    //Select Return Category Prompt
    NewComponent.prototype.lpmtReturnCategory_DataBind = function () {
        this.lpmtReturnCategory.dataSourceObservable = this.returnTypeService.GetCategoryPromptData();
    };
    //Select Return Value Validation
    NewComponent.prototype.ChangeReturnValueValidation = function (entry) {
        this.formData.ReturnValueValidation = entry;
        this.clickRadtionButton();
    };
    NewComponent.prototype.clickRadtionButton = function () {
        var _this = this;
        console.log('Radio Button Event');
        if (this.pageType == 'edit') {
            this.busy = this.returnTypeService.ExistTransaction(this.formData)
                .subscribe(function (response) {
                if (response != '') {
                    if (_this.RVVcheck == "0") {
                        _this.formData.ReturnValueValidation = 'No';
                        _this.busy = _this.returnTypeService.GetDisplayErrorMessage()
                            .subscribe(function (response) {
                        }, function (err) {
                            _this.showError(err);
                        });
                    }
                    else if (_this.RVVcheck == "1") {
                        if (response == "0") {
                            _this.formData.ReturnValueValidation = 'Mandatory';
                            _this.busy = _this.returnTypeService.GetDisplayErrorMessage()
                                .subscribe(function (response) {
                            }, function (err) {
                                _this.showError(err);
                            });
                        }
                    }
                    else if (_this.RVVcheck == "2") {
                        if (response == "0") {
                            _this.formData.ReturnValueValidation = 'WithConfirmation';
                            _this.busy = _this.returnTypeService.GetDisplayErrorMessage()
                                .subscribe(function (response) {
                            }, function (err) {
                                _this.showError(err);
                            });
                        }
                    }
                }
            }, function (err) {
                _this.showError(err);
            });
        }
    };
    NewComponent.prototype.btnOk_OnClick = function (formData) {
        var _this = this;
        this.busy = this.returnTypeService.InsertReturnType(formData)
            .subscribe(function (jsonData) {
            console.log('submited Success', jsonData);
            if (jsonData == true) {
                _this.router.navigateByUrl('/list');
            }
            else {
                _this.msgPrompt.showAlert("Data Submited Failed");
            }
        }, function (err) {
            _this.showError(err);
        });
    };
    NewComponent.prototype.goBack = function () {
        this.router.navigateByUrl('/list');
    };
    NewComponent.prototype.btnClose_OnClick = function () {
        this.goBack();
    };
    __decorate([
        core_1.ViewChild('msgPrompt'),
        __metadata("design:type", Object)
    ], NewComponent.prototype, "msgPrompt", void 0);
    __decorate([
        core_1.ViewChild('msgAlert'),
        __metadata("design:type", Object)
    ], NewComponent.prototype, "msgAlert", void 0);
    __decorate([
        core_1.ViewChild('lpmtModule'),
        __metadata("design:type", Object)
    ], NewComponent.prototype, "lpmtModule", void 0);
    __decorate([
        core_1.ViewChild('lpmtReturnCategory'),
        __metadata("design:type", Object)
    ], NewComponent.prototype, "lpmtReturnCategory", void 0);
    NewComponent = __decorate([
        core_1.Component({
            selector: 'my-new',
            templateUrl: './app/new.component/new.component.html',
            providers: [returntype_service_1.ReturnTypeService]
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, http_1.Http, router_1.Router, xont_ventura_services_1.CommonService, returntype_service_1.ReturnTypeService, xont_ventura_services_1.DatetimeService])
    ], NewComponent);
    return NewComponent;
}());
exports.NewComponent = NewComponent;
//# sourceMappingURL=new.component.js.map