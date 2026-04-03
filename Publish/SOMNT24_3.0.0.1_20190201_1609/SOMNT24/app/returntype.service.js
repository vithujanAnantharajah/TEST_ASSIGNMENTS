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
var xont_ventura_services_1 = require("xont-ventura-services");
require("rxjs/add/operator/catch");
var Rx_1 = require("rxjs/Rx");
var Subject_1 = require("rxjs/Subject");
var http_1 = require("@angular/http");
var ReturnTypeService = (function () {
    function ReturnTypeService(http, commonService, datetimeService) {
        this.http = http;
        this.commonService = commonService;
        this.datetimeService = datetimeService;
        this.componentMethodCallSource = new Subject_1.Subject();
        this.componentMethodCalled$ = this.componentMethodCallSource.asObservable();
    }
    ReturnTypeService.prototype.handleError = function (error) {
        this.componentMethodCallSource.next(error);
        return Rx_1.Observable.throw(error);
    };
    ReturnTypeService.prototype.getSiteName = function () {
        return this.commonService.getAPIPrefix('SOMNT24');
    };
    //Get Module Data for list prompt
    ReturnTypeService.prototype.GetModulePromptData = function () {
        var _this = this;
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetModulePromptData')
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //Get Module Data for New prompt
    ReturnTypeService.prototype.GetModulePromptDataForNew = function () {
        var _this = this;
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetModulePromptDataForNew')
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //Get MoCategory Prompt Data
    ReturnTypeService.prototype.GetCategoryPromptData = function () {
        var _this = this;
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetCategoryPromptData')
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //List Data
    ReturnTypeService.prototype.ListReturnTypeData = function (selectionCriteria) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.getSiteName() + '/api/SOMNT24/ListReturnTypeData', (selectionCriteria), { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //get Selected Returntype Data Item
    ReturnTypeService.prototype.SeletedReturnType = function (moduleCode, returnType) {
        var _this = this;
        return this.http.get(this.getSiteName() + '/api/SOMNT24/SeletedReturnType?moduleCode=' + moduleCode + '&returnType=' + returnType)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //Insert or Update ReturnType
    ReturnTypeService.prototype.InsertReturnType = function (formData) {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.getSiteName() + '/api/SOMNT24/InsertReturnType', (formData), { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //ExistTransaction
    ReturnTypeService.prototype.ExistTransaction = function (formData) {
        var _this = this;
        var objectData = { formData: formData };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.getSiteName() + '/api/SOMNT24/ExistTransaction', JSON.stringify(objectData), { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    //GetDisplayErrorMessage
    ReturnTypeService.prototype.GetDisplayErrorMessage = function () {
        var _this = this;
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetDisplayErrorMessage')
            .map(function (response) { return response.json(); })
            .catch(function (error) { return _this.handleError(error); });
    };
    return ReturnTypeService;
}());
ReturnTypeService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http, xont_ventura_services_1.CommonService, xont_ventura_services_1.DatetimeService])
], ReturnTypeService);
exports.ReturnTypeService = ReturnTypeService;
//# sourceMappingURL=returntype.service.js.map