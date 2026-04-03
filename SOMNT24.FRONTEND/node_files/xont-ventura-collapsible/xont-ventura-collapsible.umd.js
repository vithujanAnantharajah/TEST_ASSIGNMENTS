(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common'], factory) :
	(factory((global['xont-ventura-collapsible'] = {}),global._angular_core,global._angular_common));
}(this, (function (exports,_angular_core,_angular_common) { 'use strict';

var XontVenturaCollapsibleComponent = (function () {
    function XontVenturaCollapsibleComponent() {
        this.text = 'Selection criteria';
        this.imgSrc = '../images/imgup.png';
        this.collapsedText = '';
        this.expandedText = '';
        this._collapsed = true;
        this.onChange = new _angular_core.EventEmitter();
    }
    /**
     * @return {?}
     */
    XontVenturaCollapsibleComponent.prototype.ngAfterViewInit = function () {
        console.log('view init:', this._collapsed);
        if (this._collapsed == true) {
            this.hide();
        }
        else {
            this.show();
        }
    };
    Object.defineProperty(XontVenturaCollapsibleComponent.prototype, "in", {
        /**
         * @param {?} val
         * @return {?}
         */
        set: function (val) {
            this._collapsed = val;
            if (val == true) {
                this.hide();
            }
            else {
                this.show();
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    XontVenturaCollapsibleComponent.prototype.show = function () {
        this.text = 'Hide';
        if (this.expandedText != '') {
            this.text = this.expandedText;
        }
        this.imgSrc = '../images/imgdown.png';
        $("#" + this.targetElementID).collapse('show');
    };
    /**
     * @return {?}
     */
    XontVenturaCollapsibleComponent.prototype.hide = function () {
        this.text = 'Selection Criteria';
        if (this.collapsedText != '') {
            this.text = this.collapsedText;
        }
        this.imgSrc = '../images/imgup.png';
        $("#" + this.targetElementID).collapse('hide');
    };
    /**
     * @return {?}
     */
    XontVenturaCollapsibleComponent.prototype.onClick = function () {
        if (this._collapsed == true) {
            this.show();
        }
        else {
            this.hide();
        }
        this._collapsed = !this._collapsed;
        if (this._collapsed == true) {
            this.onChange.emit(true);
        }
        else {
            this.onChange.emit(false);
        }
    };
    return XontVenturaCollapsibleComponent;
}());
XontVenturaCollapsibleComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'xont-ventura-collapsible',
                template: "<span id=\"{{id}}\" class=\"linkButton Linkboldtext\" (click)=\"onClick()\" style=\"text-decoration: none;\" >\n  <img src=\"{{imgSrc}}\" style=\"border-width:0px;\"> &nbsp; {{text}}\n  </span>"
            },] },
];
/**
 * @nocollapse
 */
XontVenturaCollapsibleComponent.ctorParameters = function () { return []; };
XontVenturaCollapsibleComponent.propDecorators = {
    'id': [{ type: _angular_core.Input, args: ['id',] },],
    'targetElementID': [{ type: _angular_core.Input, args: ['targetElementID',] },],
    'collapsedText': [{ type: _angular_core.Input, args: ['collapsedText',] },],
    'expandedText': [{ type: _angular_core.Input, args: ['expandedText',] },],
    'in': [{ type: _angular_core.Input, args: ['collapsed',] },],
    'onChange': [{ type: _angular_core.Output },],
};

var XontVenturaCollapsibleModule = (function () {
    function XontVenturaCollapsibleModule() {
    }
    /**
     * @return {?}
     */
    XontVenturaCollapsibleModule.forRoot = function () {
        return {
            ngModule: XontVenturaCollapsibleModule
        };
    };
    return XontVenturaCollapsibleModule;
}());
XontVenturaCollapsibleModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule
                ],
                declarations: [
                    XontVenturaCollapsibleComponent
                ],
                exports: [
                    XontVenturaCollapsibleComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
XontVenturaCollapsibleModule.ctorParameters = function () { return []; };

exports.XontVenturaCollapsibleModule = XontVenturaCollapsibleModule;
exports.XontVenturaCollapsibleComponent = XontVenturaCollapsibleComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
