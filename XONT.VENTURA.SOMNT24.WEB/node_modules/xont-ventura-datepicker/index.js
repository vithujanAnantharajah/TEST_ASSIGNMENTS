import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

var XontVenturaDatepickerComponent = (function () {
    /**
     * @param {?} http
     */
    function XontVenturaDatepickerComponent(http) {
        this.http = http;
        this.onDateSelect = new EventEmitter();
        this.format = 'yyyy/mm/dd';
        this._disabled = false;
    }
    Object.defineProperty(XontVenturaDatepickerComponent.prototype, "in", {
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._disabled = val;
            if (val == true) {
                this.destroy();
            }
            else {
                this.reset();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    XontVenturaDatepickerComponent.prototype.ngOnInit = function () {
        if (localStorage.getItem('ClientDateFormat') != null) {
            this.format = localStorage.getItem('ClientDateFormat');
        }
    };
    /**
     * @return {?}
     */
    XontVenturaDatepickerComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this._disabled == true) {
            this.destroy();
        }
        else {
            this.reset();
        }
        //$('#' + this.id).datepicker('setStartDate', new Date(1753,0,1));//set min date
        //$('#' + this.id).datepicker('setEndDate', new Date(9999,11,31));//set max date
        $('#' + this.id).datepicker().on('changeDate', function (e) {
            var /** @type {?} */ year = e.date.getFullYear();
            var /** @type {?} */ month = (1 + e.date.getMonth()).toString();
            month = month.length > 1 ? month : '0' + month;
            var /** @type {?} */ date = e.date.getDate().toString();
            date = date.length > 1 ? date : '0' + date;
            var /** @type {?} */ output = '';
            if (_this.format == 'yyyy/mm/dd') {
                output = year + '/' + month + '/' + date;
            }
            else if (_this.format == 'yyyy/dd/mm') {
                output = year + '/' + date + '/' + month;
            }
            else if (_this.format == 'mm/yyyy/dd') {
                output = month + '/' + year + '/' + date;
            }
            else if (_this.format == 'mm/dd/yyyy') {
                output = month + '/' + date + '/' + year;
            }
            else if (_this.format == 'dd/yyyy/mm') {
                output = date + '/' + year + '/' + month;
            }
            else if (_this.format == 'dd/mm/yyyy') {
                output = date + '/' + month + '/' + year;
            }
            else if (_this.format == 'yyyy.mm.dd') {
                output = year + '.' + month + '.' + date;
            }
            else if (_this.format == 'yyyy.dd.mm') {
                output = year + '.' + date + '.' + month;
            }
            else if (_this.format == 'mm.yyyy.dd') {
                output = month + '.' + year + '.' + date;
            }
            else if (_this.format == 'mm.dd.yyyy') {
                output = month + '.' + date + '.' + year;
            }
            else if (_this.format == 'dd.yyyy.mm') {
                output = date + '.' + year + '.' + month;
            }
            else if (_this.format == 'dd.mm.yyyy') {
                output = date + '.' + month + '.' + year;
            }
            else if (_this.format == 'yyyy-mm-dd') {
                output = year + '-' + month + '-' + date;
            }
            else if (_this.format == 'yyyy-dd-mm') {
                output = year + '-' + date + '-' + month;
            }
            else if (_this.format == 'mm-yyyy-dd') {
                output = month + '-' + year + '-' + date;
            }
            else if (_this.format == 'mm-dd-yyyy') {
                output = month + '-' + date + '-' + year;
            }
            else if (_this.format == 'dd-yyyy-mm') {
                output = date + '-' + year + '-' + month;
            }
            else if (_this.format == 'dd-mm-yyyy') {
                output = date + '-' + month + '-' + year;
            }
            else {
                alert('Invalid date format in "ventura.config.json"');
            }
            _this.onDateSelect.emit(output);
            //$('#' + this.targetElementID).val(output);
        });
    };
    /**
     * @return {?}
     */
    XontVenturaDatepickerComponent.prototype.destroy = function () {
        $('#' + this.id).datepicker('destroy');
    };
    /**
     * @return {?}
     */
    XontVenturaDatepickerComponent.prototype.reset = function () {
        console.log("reset");
        $('#' + this.id).datepicker({
            todayHighlight: true, autoclose: true, todayBtn: "linked"
        });
    };
    return XontVenturaDatepickerComponent;
}());
XontVenturaDatepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'xont-ventura-datepicker',
                template: "\n                    <button id=\"{{id}}\" class=\"btn btn-xs\" type=\"button\" [disabled]=\"_disabled\" ><i class=\"fa fa-calendar\" ></i></button>\n                "
            },] },
];
/**
 * @nocollapse
 */
XontVenturaDatepickerComponent.ctorParameters = function () { return [
    { type: Http, },
]; };
XontVenturaDatepickerComponent.propDecorators = {
    'id': [{ type: Input },],
    'onDateSelect': [{ type: Output },],
    'in': [{ type: Input, args: ['disabled',] },],
};

var XontVenturaDatepickerModule = (function () {
    function XontVenturaDatepickerModule() {
    }
    /**
     * @return {?}
     */
    XontVenturaDatepickerModule.forRoot = function () {
        return {
            ngModule: XontVenturaDatepickerModule
        };
    };
    return XontVenturaDatepickerModule;
}());
XontVenturaDatepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    XontVenturaDatepickerComponent
                ],
                exports: [
                    XontVenturaDatepickerComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
XontVenturaDatepickerModule.ctorParameters = function () { return []; };

export { XontVenturaDatepickerModule, XontVenturaDatepickerComponent };
