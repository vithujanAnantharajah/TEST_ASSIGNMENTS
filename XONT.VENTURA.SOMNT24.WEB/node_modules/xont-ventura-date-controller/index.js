import { Component, EventEmitter, Input, NgModule, Output, ViewChild, forwardRef } from '@angular/core';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var DateControllerComponent = (function () {
    function DateControllerComponent() {
        this.id = '';
        this.validationFloatSide = '';
        this.enabled = true;
        this.width = 100;
        this.allowPastDates = true;
        this.allowCurrentDate = true;
        this.allowFutureDates = true;
        this.msgPastDates = 'Past dates are not allowed.';
        this.msgCurrentDate = 'Current date is not allowed.';
        this.msgFutureDates = 'Future dates are not allowed.';
        this.msgInvalidDate = 'Invalid date';
        this.msgLessThan = 'From Date cannot be greater than To Date.';
        this.msgGreaterThan = 'From Date cannot be greater than To Date.';
        //whenever input value changes to a valid status(valid value or empty)
        this.onChange = new EventEmitter();
        this._errorMessage = '';
        this._greaterThan = '';
        this._lessThan = '';
        this._shFormat = 'CDF not found';
        this._mandatoryFailed = false;
        this._shouldInvoke = true;
        //Implementing Validator end
        //Implementing ControlValueAccessor start
        // Function to call when the date changes.
        this.onModelChangeCB = function (model) { };
    }
    Object.defineProperty(DateControllerComponent.prototype, "greaterThan", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this._greaterThan = value;
            //to push down in the eventloop
            setTimeout(function () {
                _this.updateModel();
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateControllerComponent.prototype, "lessThan", {
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            var _this = this;
            this._lessThan = value;
            //to push down in the eventloop
            setTimeout(function () {
                _this.updateModel();
            }, 0);
        },
        enumerable: true,
        configurable: true
    });
    //Component Events start
    /**
     * @return {?}
     */
    DateControllerComponent.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!DateControllerComponent.FORMAT) {
            if (localStorage.getItem('ClientDateFormat') != null) {
                DateControllerComponent.FORMAT = localStorage.getItem('ClientDateFormat');
                if (DateControllerComponent.FORMAT.indexOf('/') > 0) {
                    DateControllerComponent.SEP_KEYCODES = [191, 111];
                    DateControllerComponent.SEPARATOR = '/';
                }
                else if (DateControllerComponent.FORMAT.indexOf('-') > 0) {
                    DateControllerComponent.SEP_KEYCODES = [189, 109];
                    DateControllerComponent.SEPARATOR = '-';
                }
                else if (DateControllerComponent.FORMAT.indexOf('.') > 0) {
                    DateControllerComponent.SEP_KEYCODES = [190, 46];
                    DateControllerComponent.SEPARATOR = '.';
                }
                else
                    console.error('this is from date controller - error in client date format check both web.config and ventura.config.json to verify that the client date format is correct');
                //shortest possible format
                DateControllerComponent.SH_FORMAT = DateControllerComponent.FORMAT.toUpperCase().replace('YYYY', 'Y').replace('MM', 'M').replace('DD', 'D');
                //to get the indexes of date parts.
                var /** @type {?} */ strippedFormat = DateControllerComponent.SH_FORMAT.replace(DateControllerComponent.SEPARATOR, '').replace(DateControllerComponent.SEPARATOR, '');
                DateControllerComponent.Y_INDEX = strippedFormat.indexOf('Y');
                DateControllerComponent.M_INDEX = strippedFormat.indexOf('M');
                DateControllerComponent.D_INDEX = strippedFormat.indexOf('D');
            }
            else {
                console.error('this is from date controller - error in client date format check both web.config and ventura.config.json to verify that the client date format is correct');
            }
        }
        //template only accepts instance variables
        this._shFormat = DateControllerComponent.SH_FORMAT;
        $(this.calButton.nativeElement).datepicker({
            todayHighlight: true,
            autoclose: true,
            todayBtn: "linked",
            pickerPosition: 'bottom-right'
        });
        $(this.calButton.nativeElement).datepicker().on('changeDate', function (e) {
            if (_this._shouldInvoke) {
                var /** @type {?} */ output = DateControllerComponent.GET_DATE_FROM_OBJECT(e.date);
                _this._innerModel = output;
                _this.updateModel();
                _this.onChange.emit(output);
            }
            else {
                _this._shouldInvoke = true;
            }
        });
    };
    /**
     * @return {?}
     */
    DateControllerComponent.prototype.focus = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ self = this;
        /**
         * @return {?}
         */
        function setFocus() {
            if (self.calText) {
                self.calText.nativeElement.focus();
            }
            else {
                setTimeout(setFocus, 100);
            }
        }
        setFocus();
    };
    //Public Methods end
    //View Events start
    /**
     * @return {?}
     */
    DateControllerComponent.prototype.InputChanged = /**
     * @return {?}
     */
    function () {
        if (this._innerModel) {
            var /** @type {?} */ date = DateControllerComponent.GET_VALID_DATE(this._innerModel);
            if (date) {
                //this will invoke the changeDate event of the picker
                $(this.calButton.nativeElement).datepicker('setDate', date);
            }
        }
        else {
            this.onChange.emit(this._innerModel);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DateControllerComponent.prototype.InputKeyDown = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!this.IsKeyAllowed(event)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DateControllerComponent.prototype.InputKeyUp = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!this.IsKeyAllowed(event)) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
        this.updateModel();
    };
    /**
     * @param {?} c
     * @return {?}
     */
    DateControllerComponent.prototype.validate = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        var /** @type {?} */ controlSelectedDate = null;
        //complying with the native nature of an angular controller
        //these are declared in negation form since these will be returned as object props if validation error were to occur.
        var /** @type {?} */ required = false; //if required validation fails.
        var /** @type {?} */ date = false; //if the validation fails
        var /** @type {?} */ past = false; //if past validation fails
        var /** @type {?} */ current = false; //if current date validation fails
        var /** @type {?} */ future = false; //if future date validation fails
        var /** @type {?} */ lessThan = false; //if compare dates validation fails.
        var /** @type {?} */ greaterThan = false; //if compare dates validation fails.
        //validating for required validation. (should have let angular handle this now too late)
        if (this.required !== false && (this.required !== undefined || this.required === true) && !this._innerModel) {
            this._mandatoryFailed = true;
            required = true;
        }
        else {
            this._mandatoryFailed = false;
        }
        //validating selected date of the control
        if (this._innerModel) {
            controlSelectedDate = DateControllerComponent.GET_VALID_DATE(this._innerModel);
            date = !controlSelectedDate;
        }
        //if entered day is correct then begin other validations
        if (controlSelectedDate) {
            //if the selected date is correct validate for past, current or future date validation
            if (!date && (!this.allowPastDates || !this.allowCurrentDate || !this.allowFutureDates)) {
                var /** @type {?} */ currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                if (!this.allowPastDates) {
                    if (currentDate.getTime() > controlSelectedDate.getTime()) {
                        past = true;
                    }
                }
                if (!this.allowCurrentDate) {
                    if (currentDate.getTime() == controlSelectedDate.getTime()) {
                        current = true;
                    }
                }
                if (!this.allowFutureDates) {
                    if (currentDate.getTime() < controlSelectedDate.getTime()) {
                        future = true;
                    }
                }
            }
            //if and only if above validations are ok then validate for lessThan validation.
            if (!date && !past && !current && !future && this._lessThan) {
                var /** @type {?} */ toDate = DateControllerComponent.GET_VALID_DATE(this._lessThan);
                if (toDate && controlSelectedDate && (toDate.getTime() < controlSelectedDate.getTime())) {
                    lessThan = true;
                }
                else {
                    lessThan = false;
                }
            }
            //if and only if above validations are ok then validate for greaterThan validation.
            if (!date && !past && !current && !future && !lessThan && this._greaterThan) {
                var /** @type {?} */ fromDate = DateControllerComponent.GET_VALID_DATE(this._greaterThan);
                if (fromDate && controlSelectedDate && (fromDate.getTime() > controlSelectedDate.getTime())) {
                    greaterThan = true;
                }
                else {
                    greaterThan = false;
                }
            }
        }
        //all the error showing will be implemented here
        if (required)
            this._errorMessage = ''; //astric mark will be handled by the template itself with a differenct CSS class.
        else if (date)
            this._errorMessage = this.msgInvalidDate;
        else if (past)
            this._errorMessage = this.msgPastDates;
        else if (current)
            this._errorMessage = this.msgCurrentDate;
        else if (future)
            this._errorMessage = this.msgFutureDates;
        else if (lessThan)
            this._errorMessage = this.msgLessThan;
        else if (greaterThan)
            this._errorMessage = this.msgGreaterThan;
        else
            this._errorMessage = '';
        if (!required && !date && !past && !current && !future && !lessThan && !greaterThan)
            return null;
        else
            return { any: true, required: required, date: date, past: past, current: current, future: future, lessThan: lessThan, greaterThan: greaterThan };
    };
    /**
     * @param {?} model
     * @return {?}
     */
    DateControllerComponent.prototype.writeValue = /**
     * @param {?} model
     * @return {?}
     */
    function (model) {
        this._innerModel = model;
        this.onModelChangeCB(this._innerModel);
        if (model) {
            var /** @type {?} */ date = DateControllerComponent.GET_VALID_DATE(model);
            if (date) {
                this._shouldInvoke = false;
                $(this.calButton.nativeElement).datepicker('setDate', date);
            }
        }
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    DateControllerComponent.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onModelChangeCB = fn;
    };
    // Allows Angular to register a function to call when the input has been touched.
    // Save the function as a property to call later here.
    /**
     * @param {?} fn
     * @return {?}
     */
    DateControllerComponent.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
    };
    // Allows Angular to disable the input.
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    DateControllerComponent.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this.enabled = !isDisabled;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DateControllerComponent.prototype.IsKeyAllowed = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ iKeyCode = event.keyCode;
        if ((iKeyCode >= 48 && iKeyCode <= 57) //number keys in upper row with chars.
            || (iKeyCode >= 96 && iKeyCode <= 105) //number keys in num pad.
            || iKeyCode == DateControllerComponent.SEP_KEYCODES[0] //seperator key in upper key set.
            || iKeyCode == DateControllerComponent.SEP_KEYCODES[1] //seperator key in num pad.
            || iKeyCode == 37 //arrow left
            || iKeyCode == 39 //arrow right
            || iKeyCode == 46 //delete
            || iKeyCode == 8 //backspace
            || iKeyCode == 9 //tab
            || iKeyCode == 67 && event.ctrlKey // ctrl+c
            || iKeyCode == 88 && event.ctrlKey // ctrl+x
            || iKeyCode == 90 && event.ctrlKey // ctrl+z
            || iKeyCode == 86 && event.ctrlKey // ctrl+v
            || iKeyCode == 65 && event.ctrlKey) {
            return true;
        }
        return false;
    };
    /**
     * @return {?}
     */
    DateControllerComponent.prototype.updateModel = /**
     * @return {?}
     */
    function () {
        this.onModelChangeCB(this._innerModel);
    };
    /**
     * @param {?} input
     * @return {?}
     */
    DateControllerComponent.GET_VALID_DATE = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var /** @type {?} */ selectedDate = null;
        //must have atleast 5 chars to be a valid date string.
        if (input.length < 5)
            return selectedDate;
        else if (input.indexOf('+') >= 0)
            return selectedDate;
        var /** @type {?} */ dateArray = input.split(DateControllerComponent.SEPARATOR);
        //must have three parts to be a valid date string.
        if (dateArray.length != 3)
            return selectedDate;
        var /** @type {?} */ dtY = Number.parseInt(dateArray[DateControllerComponent.Y_INDEX].trim());
        var /** @type {?} */ dtM = Number.parseInt(dateArray[DateControllerComponent.M_INDEX].trim());
        var /** @type {?} */ dtD = Number.parseInt(dateArray[DateControllerComponent.D_INDEX].trim());
        //those three parts must be numbers
        if (isNaN(dtY) || isNaN(dtM) || isNaN(dtD))
            return selectedDate;
        //if the year value is less than 100 then add 2000 to make it a tollarated year in new millennium.
        if (dtY < 100)
            dtY += 2000;
        //those three parts must be within calander attribute range and SQL server datetime object savable
        if (dtM < 1 || dtM > 12 || dtD < 1 || dtD > 31 || dtY <= 1752 || dtY > 9999)
            return selectedDate;
        else if ((dtM == 4 || dtM == 6 || dtM == 9 || dtM == 11) && dtD == 31)
            return selectedDate;
        else if (dtM == 2) {
            var /** @type {?} */ isleap = (dtY % 4 == 0 && (dtY % 100 != 0 || dtY % 400 == 0));
            if (dtD > 29 || (dtD == 29 && !isleap))
                return selectedDate;
        }
        //if everything is correct return the date object.
        selectedDate = new Date(dtY, dtM - 1, dtD);
        return selectedDate;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    DateControllerComponent.GET_DATE_FROM_OBJECT = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        var /** @type {?} */ year = date.getFullYear();
        var /** @type {?} */ month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var /** @type {?} */ day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var /** @type {?} */ dateParts = [];
        dateParts[DateControllerComponent.Y_INDEX] = year;
        dateParts[DateControllerComponent.M_INDEX] = month;
        dateParts[DateControllerComponent.D_INDEX] = day;
        var /** @type {?} */ output = dateParts.join(DateControllerComponent.SEPARATOR);
        return output;
    };
    DateControllerComponent.FORMAT = '';
    DateControllerComponent.Y_INDEX = -1;
    DateControllerComponent.M_INDEX = -1;
    DateControllerComponent.D_INDEX = -1;
    DateControllerComponent.SEPARATOR = '';
    DateControllerComponent.SEP_KEYCODES = null;
    DateControllerComponent.SH_FORMAT = '';
    DateControllerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'xont-ventura-date-controller',
                    template: "<span style=\"margin-right:15px;\"><span style=\"position:relative;\">\n         <input #calText class=\"Textboxstyle\" placeholder=\"{{_shFormat}}\" [style.width]=\"width +'px'\"\n            [(ngModel)]=\"_innerModel\" [disabled]=\"!enabled\" maxlength=\"10\" [class.disabledInput]=\"!enabled\"\n            (keydown)=\"InputKeyDown($event)\"\n            (change)=\"InputChanged()\"\n            (keyup)=\"InputKeyUp($event)\">\n         <button #calButton class=\"btn btn-xs\"\n                 type=\"button\" [disabled]=\"!enabled\" >\n                <i class=\"fa fa-calendar\" ></i>\n         </button>\n         <span class=\"dtcMandatoryValidatorStyle dtcc\" *ngIf=\"_mandatoryFailed\"> * </span>\n         <span *ngIf=\"_errorMessage && !validationFloatSide\" class=\"Errormessagetextstyle\"> {{_errorMessage}} </span>\n         <span class=\"Errormessagetextstyle {{validationFloatSide}}\" *ngIf=\"_errorMessage && validationFloatSide\"> {{_errorMessage}} </span>\n    </span></span>",
                    styles: [
                        'input {padding-left:3px;}',
                        '.dtcMandatoryValidatorStyle {position:absolute;right:-11.5px;top:0px;color:#e50505;font-family:Trebuchet MS;font-size:20px;font-style:normal;}',
                        '.disabledInput {background-color: rgba(170, 170, 170, 0.19); cursor:not-allowed;}',
                        ".Left, .Right, .left, .right {\n            position: absolute;\n            overflow: visible;\n            white-space: nowrap;\n            background: white;\n            border: 1px solid;\n            padding: 2px 5px;\n            border-radius: 16px;\n            z-index: 2;\n            color: red;\n        }",
                        '.Left, .left {top:120%;right:20%;}',
                        '.Right, .right {top:120%;left:20%;}'
                    ],
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return DateControllerComponent; }),
                            multi: true
                        },
                        {
                            provide: NG_VALIDATORS,
                            useExisting: forwardRef(function () { return DateControllerComponent; }),
                            multi: true,
                        }
                    ]
                },] },
    ];
    //private methods end
    /** @nocollapse */
    DateControllerComponent.propDecorators = {
        "id": [{ type: Input },],
        "validationFloatSide": [{ type: Input },],
        "enabled": [{ type: Input },],
        "required": [{ type: Input },],
        "width": [{ type: Input },],
        "allowPastDates": [{ type: Input },],
        "allowCurrentDate": [{ type: Input },],
        "allowFutureDates": [{ type: Input },],
        "msgPastDates": [{ type: Input },],
        "msgCurrentDate": [{ type: Input },],
        "msgFutureDates": [{ type: Input },],
        "msgInvalidDate": [{ type: Input },],
        "msgLessThan": [{ type: Input },],
        "msgGreaterThan": [{ type: Input },],
        "greaterThan": [{ type: Input },],
        "lessThan": [{ type: Input },],
        "onChange": [{ type: Output },],
        "calButton": [{ type: ViewChild, args: ['calButton',] },],
        "calText": [{ type: ViewChild, args: ['calText',] },],
    };
    return DateControllerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var XontVenturaDateControllerModule = (function () {
    function XontVenturaDateControllerModule() {
    }
    /**
     * @return {?}
     */
    XontVenturaDateControllerModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: XontVenturaDateControllerModule,
        };
    };
    XontVenturaDateControllerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule, FormsModule
                    ],
                    declarations: [
                        DateControllerComponent
                    ],
                    exports: [
                        DateControllerComponent
                    ]
                },] },
    ];
    return XontVenturaDateControllerModule;
}());

export { XontVenturaDateControllerModule, DateControllerComponent };
