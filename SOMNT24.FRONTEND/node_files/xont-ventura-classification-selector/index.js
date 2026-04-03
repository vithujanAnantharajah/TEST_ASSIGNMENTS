import { Component, Directive, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { CommonService } from 'xont-ventura-services';
import { BusyModule } from 'angular2-busy';
import { DataTableModule } from 'angular2-datatable';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { filter } from 'lodash';

var XontVenturaCaptionTranslateService = (function () {
    /**
     * @param {?} http
     * @param {?} commonService
     */
    function XontVenturaCaptionTranslateService(http$$1, commonService) {
        this.http = http$$1;
        this.commonService = commonService;
    }
    /**
     * @return {?}
     */
    XontVenturaCaptionTranslateService.prototype.GetApiPrefix = function () {
        return this.commonService.getAPIPrefix();
    };
    /**
     * @return {?}
     */
    XontVenturaCaptionTranslateService.prototype.GetCaptions = function () {
        return this.http.get(this.GetApiPrefix() + "/api/CaptionTranslate/GetCaptions")
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Observable.throw(error.json()); });
    };
    /**
     * @param {?} caption
     * @return {?}
     */
    XontVenturaCaptionTranslateService.prototype.UpdateCaption = function (caption) {
        var /** @type {?} */ headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.GetApiPrefix() + "/api/CaptionTranslate/UpdateCaption", caption, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return Observable.throw(error.json()); });
    };
    return XontVenturaCaptionTranslateService;
}());
XontVenturaCaptionTranslateService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
XontVenturaCaptionTranslateService.ctorParameters = function () { return [
    { type: Http, },
    { type: CommonService, },
]; };

var XontVenturaTranslateDirective = (function () {
    /**
     * @param {?} _element
     * @param {?} _service
     */
    function XontVenturaTranslateDirective(_element, _service) {
        this._element = _element;
        this._service = _service;
        this._originalCaption = '';
        this._translated = false;
        this.foundCaption = null;
        if (!XontVenturaTranslateDirective.LOADED) {
            var captionData = localStorage.getItem('Caption_List');
            if (captionData) {
                var parsedCaptionData = JSON.parse(captionData);
                XontVenturaTranslateDirective.CAPTIONS = parsedCaptionData.captions;
                XontVenturaTranslateDirective.SELECTED_LANG = parsedCaptionData.lang;
                XontVenturaTranslateDirective.PERMITTED_USER = parsedCaptionData.permitted;
                XontVenturaTranslateDirective.LOADED = true;
            }
        }
    }
    /**
     * @param {?} caption
     * @return {?}
     */
    XontVenturaTranslateDirective.prototype.setCaption = function (caption) {
        if (XontVenturaTranslateDirective.SELECTED_LANG == '0' && caption.Sinhala) {
            this._element.nativeElement.innerText = caption.Sinhala;
        }
        else if (XontVenturaTranslateDirective.SELECTED_LANG == '1' && caption.English) {
            this._element.nativeElement.innerText = caption.English;
        }
        else if (XontVenturaTranslateDirective.SELECTED_LANG == '2' && caption.Tamil) {
            this._element.nativeElement.innerText = caption.Tamil;
        }
        this._translated = true;
    };
    /**
     * @return {?}
     */
    XontVenturaTranslateDirective.prototype.findCaption = function () {
        var _this = this;
        if (!this._originalCaption)
            this._originalCaption = this._element.nativeElement.innerText;
        if (!this._translated && this._originalCaption && XontVenturaTranslateDirective.CAPTIONS && XontVenturaTranslateDirective.CAPTIONS.length != 0) {
            if (this._originalCaption) {
                this.foundCaption = XontVenturaTranslateDirective.CAPTIONS.find(function (c) { return c.OriginalCaption == _this._originalCaption; });
            }
        }
    };
    /**
     * @return {?}
     */
    XontVenturaTranslateDirective.prototype.ngOnInit = function () {
        this.findCaption();
        if (this.foundCaption) {
            this.setCaption(this.foundCaption);
        }
        else {
            var /** @type {?} */ self_1 = this;
            // configuration of the observer:
            var /** @type {?} */ config = { attributes: false, childList: false, characterData: true, subtree: true };
            // create an observer instance
            var /** @type {?} */ observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    var /** @type {?} */ element = mutation.target;
                    self_1.findCaption();
                    if (self_1.foundCaption) {
                        observer.disconnect();
                        self_1.setCaption(self_1.foundCaption);
                    }
                });
            });
            observer.observe(this._element.nativeElement, config);
        }
    };
    /**
     * @return {?}
     */
    XontVenturaTranslateDirective.prototype.onclick = function () {
        var /** @type {?} */ globalEvent = window.event;
        var /** @type {?} */ isWithCtrl = globalEvent.ctrlKey;
        if (isWithCtrl) {
            if (XontVenturaTranslateDirective.PERMITTED_USER) {
                if (this._element.nativeElement.innerText.trim() != this._element.nativeElement.innerHTML.trim())
                    return;
                var /** @type {?} */ translatorOuterDiv_1 = document.createElement('div');
                translatorOuterDiv_1.id = "translatorOuterDiv";
                var /** @type {?} */ translatorInnerDiv = document.createElement('div');
                translatorInnerDiv.id = "translatorInnerDiv";
                var /** @type {?} */ headerCaption = document.createElement('div');
                headerCaption.id = "translatorHeaderCaption";
                headerCaption.innerText = 'Update Dictionary for Original Caption "' + this._originalCaption + '"';
                headerCaption.classList.add("Captionstyle");
                var /** @type {?} */ englishCaption = document.createElement('div');
                englishCaption.innerText = "English";
                englishCaption.classList.add("Captionstyle");
                englishCaption.classList.add("TranslatorCpation");
                var /** @type {?} */ englishInput_1 = document.createElement('input');
                englishInput_1.type = "text";
                englishInput_1.id = "englishInput";
                englishInput_1.classList.add("Textboxstyle");
                englishInput_1.setAttribute("autocomplete", "off");
                var /** @type {?} */ sinhalaCaption = document.createElement('div');
                sinhalaCaption.innerText = "Sinhala";
                sinhalaCaption.classList.add("Captionstyle");
                var /** @type {?} */ sinhalaInput_1 = document.createElement('input');
                sinhalaInput_1.type = "text";
                sinhalaInput_1.id = "sinhalaInput";
                sinhalaInput_1.classList.add("Textboxstyle");
                sinhalaInput_1.setAttribute("autocomplete", "off");
                var /** @type {?} */ tamilCaption = document.createElement('div');
                tamilCaption.innerText = "Tamil";
                tamilCaption.classList.add("Captionstyle");
                var /** @type {?} */ tamilInput_1 = document.createElement('input');
                tamilInput_1.type = "text";
                tamilInput_1.id = "tamilInput";
                tamilInput_1.classList.add("Textboxstyle");
                tamilInput_1.setAttribute("autocomplete", "off");
                var /** @type {?} */ btnSave = document.createElement('button');
                btnSave.innerText = "OK";
                btnSave.id = "btnSave";
                btnSave.classList.add("MainButtonStyle");
                if (this.foundCaption) {
                    englishInput_1.value = this.foundCaption.English;
                    sinhalaInput_1.value = this.foundCaption.Sinhala;
                    tamilInput_1.value = this.foundCaption.Tamil;
                }
                var /** @type {?} */ self_2 = this;
                btnSave.onclick = function () {
                    //update caption
                    if (self_2.foundCaption) {
                        self_2.foundCaption.English = englishInput_1.value;
                        self_2.foundCaption.Sinhala = sinhalaInput_1.value;
                        self_2.foundCaption.Tamil = tamilInput_1.value;
                        self_2.foundCaption.UpdateMode = 'U';
                    }
                    else {
                        self_2.foundCaption = {
                            RecID: "",
                            OriginalCaption: self_2._originalCaption,
                            English: englishInput_1.value,
                            Sinhala: sinhalaInput_1.value,
                            Tamil: tamilInput_1.value,
                            UpdateMode: 'N'
                        };
                    }
                    self_2._service.UpdateCaption(self_2.foundCaption).subscribe(function (data) { console.log('here goes the translator update result ' + data); }, function (error) { console.error('error happned in translator caption update ', error, 'here goes the caption', self_2.foundCaption); }, function () { console.log('translator caption update completed'); });
                    self_2.setCaption(self_2.foundCaption);
                    translatorOuterDiv_1.parentElement.removeChild(translatorOuterDiv_1);
                };
                var /** @type {?} */ btnCancel = document.createElement('button');
                btnCancel.innerText = "Cancel";
                btnCancel.id = "btnCancel";
                btnCancel.classList.add("MainButtonStyle");
                btnCancel.onclick = function () {
                    translatorOuterDiv_1.parentElement.removeChild(translatorOuterDiv_1);
                };
                var /** @type {?} */ btnDefault = document.createElement('button');
                btnDefault.innerText = "Reset";
                btnDefault.id = "btnDefault";
                btnDefault.classList.add("MainButtonStyle");
                btnDefault.onclick = function () {
                    if (self_2.foundCaption) {
                        self_2.foundCaption.UpdateMode = 'D';
                        self_2._element.nativeElement.innerText = self_2._originalCaption;
                        self_2._service.UpdateCaption(self_2.foundCaption).subscribe(function (data) { console.log('here goes the translator caption delete result ' + data); }, function (error) { console.error('error happned in translator caption delete ', error, 'here goes the caption', self_2.foundCaption); }, function () { console.log('translator caption delete completed'); });
                        self_2.foundCaption = null;
                    }
                    translatorOuterDiv_1.parentElement.removeChild(translatorOuterDiv_1);
                };
                var /** @type {?} */ btnWrapper = document.createElement('div');
                btnWrapper.classList.add("translatorBtnWrapper");
                btnWrapper.appendChild(btnSave);
                btnWrapper.appendChild(btnCancel);
                btnWrapper.appendChild(btnDefault);
                translatorInnerDiv.appendChild(headerCaption);
                translatorInnerDiv.appendChild(englishCaption);
                translatorInnerDiv.appendChild(englishInput_1);
                translatorInnerDiv.appendChild(sinhalaCaption);
                translatorInnerDiv.appendChild(sinhalaInput_1);
                translatorInnerDiv.appendChild(tamilCaption);
                translatorInnerDiv.appendChild(tamilInput_1);
                translatorInnerDiv.appendChild(btnWrapper);
                translatorOuterDiv_1.appendChild(translatorInnerDiv);
                document.getElementsByTagName("body")[0].appendChild(translatorOuterDiv_1);
            }
            else {
                //show not permitted user toast
                var /** @type {?} */ notPermittedDiv_1 = document.createElement('div');
                notPermittedDiv_1.id = "translatorNotPermittedDiv";
                notPermittedDiv_1.innerText = 'You are Not Permitted to Modify Captions.';
                notPermittedDiv_1.classList.add("Captionstyle");
                document.getElementsByTagName("body")[0].appendChild(notPermittedDiv_1);
                var /** @type {?} */ opacity_1 = 1;
                var /** @type {?} */ fadeEffect = setInterval(function () {
                    if (opacity_1 > 0) {
                        opacity_1 -= 0.08;
                        notPermittedDiv_1.style.opacity = opacity_1.toString();
                    }
                    else {
                        clearInterval(fadeEffect);
                        notPermittedDiv_1.parentElement.removeChild(notPermittedDiv_1);
                    }
                }, 200);
            }
        }
    };
    return XontVenturaTranslateDirective;
}());
XontVenturaTranslateDirective.CAPTIONS = [];
XontVenturaTranslateDirective.LOADED = false;
XontVenturaTranslateDirective.SELECTED_LANG = '1';
XontVenturaTranslateDirective.PERMITTED_USER = false;
XontVenturaTranslateDirective.decorators = [
    { type: Directive, args: [{
                selector: 'div.Captionstyle'
            },] },
];
/**
 * @nocollapse
 */
XontVenturaTranslateDirective.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: XontVenturaCaptionTranslateService, },
]; };
XontVenturaTranslateDirective.propDecorators = {
    'onclick': [{ type: HostListener, args: ['click',] },],
};

var XontVenturaClassificationSelectorComponent = (function () {
    /**
     * @param {?} http
     * @param {?} location
     * @param {?} commanService
     */
    function XontVenturaClassificationSelectorComponent(http$$1, location, commanService) {
        this.http = http$$1;
        this.location = location;
        this.commanService = commanService;
        this.selector = [];
        this.selectedClassifications = [];
        this.list = [];
        this.promptIndex = 0;
        this._valid = true;
        this._originalDataSet = null;
        this._dataSet = null;
        this._minWidth = 500;
        this._dataSliderStatus = 'none';
        this._stillDataLoading = false;
        this._pageSize = 10;
        this._gridHeaders = ['Code', 'Description'];
        this._gridFields = ['MasterGroupValue', 'MasterGroupValueDescription'];
        this._currentClsGroupIndex = -1;
        this._codeEmptied = false;
        this._descEmptied = true;
        this._cursorInCorD = '';
        this.taskCode = '';
        this.codeTextWidth = '100px';
        this.enableUserInput = 'true';
        this.descriptionTextWidth = '200px';
        this.labelWidth = "100px";
        this.activeStatus = 'Active';
        this._allMandatory = 'false';
        //V3005
        this.lastLevelRequired = 'false';
        this.enabled = 'true';
        this.onChange = new EventEmitter();
    }
    Object.defineProperty(XontVenturaClassificationSelectorComponent.prototype, "allMandatory", {
        /**
         * @return {?}
         */
        get: function () {
            return this._allMandatory;
        },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this._allMandatory = value;
            this.validate();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.siteName = function () {
        return this.commanService.getAPIPrefix(this.taskCode);
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.clsBusy = this.http.get(this.siteName() + "/api/Prompt/GetMasterCodes?ClassificationType=" + this.classificationType)
            .subscribe(function (data) {
            _this.list = data.json();
            for (var /** @type {?} */ i = 0; i < _this.list.length; i++) {
                var /** @type {?} */ obj = {
                    index: i,
                    txtCode: '',
                    txtDesc: '',
                    GroupDescription: _this.list[i].GroupDescription.trim(),
                    HierarchyRequired: _this.list[i].HierarchyRequired.trim(),
                    MasterGroup: _this.list[i].MasterGroup.trim(),
                    ErrorMessage: undefined,
                    LatestText: ''
                };
                _this.selector.push(obj);
            }
            if (_this.selectedClassifications.length > 0) {
                _this.applySelectedClassifications(_this.selectedClassifications);
                _this.selectedClassifications = [];
            }
            _this.validate();
        }, function (err) {
            console.log(err.json());
        }, function () { return console.log("observable complete"); });
        var /** @type {?} */ codeWidth = parseInt(this.codeTextWidth.replace('px', ''));
        var /** @type {?} */ descWidth = parseInt(this.descriptionTextWidth.replace('px', ''));
        this._minWidth = codeWidth + descWidth;
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.focus = function () {
        var /** @type {?} */ self = this;
        function setFocus() {
            if (self.codeInputs && self.codeInputs.toArray()[0]) {
                self.codeInputs.toArray()[0].nativeElement.focus();
            }
            else {
                setTimeout(setFocus, 100);
                
            }
        }
        setFocus();
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.InputFocus = function () {
        if (this.element.nativeElement.attributes['disabled']) {
            this.enabled = 'false';
            return;
        }
    };
    /**
     * @param {?} e
     * @param {?} isLast
     * @param {?} clsGroupIndex
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.InputMousedIn = function (e, isLast, clsGroupIndex) {
        if (this.element.nativeElement.attributes['disabled']) {
            this.enabled = 'false';
            return;
        }
        this._cursorInCorD = isLast ? 'D' : 'C';
        if (this._currentClsGroupIndex != -1 && this._currentClsGroupIndex != clsGroupIndex) {
            this.ResetProps();
        }
        if (this._dataSliderStatus == 'block') {
            this.FilterSource();
        }
        if (this._dataSliderStatus == 'none') {
            this._dataSliderStatus = 'block';
            this.PopulateDataSet(clsGroupIndex);
        }
    };
    /**
     * @param {?} e
     * @param {?} isLast
     * @param {?} clsGroupIndex
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.InputKeyDown = function (e, isLast, clsGroupIndex) {
        if (e.keyCode == 32 && this._dataSet == null) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        else if (isLast && e.keyCode == 9 && this._dataSliderStatus == 'block') {
            if (!this.isEmpty) {
                this.FilterSource();
                var /** @type {?} */ item = (this._dataSet && this._dataSet.length > 0) ? this._dataSet[0] : null;
                this.SetModel(item);
            }
            else {
                this.SetModel(null);
            }
            this.ResetProps();
        }
        this._cursorInCorD = isLast ? 'D' : 'C';
        var /** @type {?} */ currentGroupObj = this.selector[clsGroupIndex];
        var /** @type {?} */ codeValue = currentGroupObj.txtCode;
        var /** @type {?} */ descValue = currentGroupObj.txtDesc;
        if (!codeValue && !isLast && e.keyCode == 8 && this._codeEmptied) {
            e.preventDefault();
            this.descInputs.toArray()[clsGroupIndex].nativeElement.focus();
            this._cursorInCorD = 'D';
            this.FilterSource();
            this._codeEmptied = false;
        }
        else if (!descValue && isLast && e.keyCode == 8 && this._descEmptied) {
            e.preventDefault();
            this.codeInputs.toArray()[clsGroupIndex].nativeElement.focus();
            this._cursorInCorD = 'C';
            this.FilterSource();
            this._descEmptied = false;
        }
    };
    /**
     * @param {?} e
     * @param {?} isLast
     * @param {?} clsGroupIndex
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.InputKeyUp = function (e, isLast, clsGroupIndex) {
        if (this._currentClsGroupIndex != -1 && this._currentClsGroupIndex != clsGroupIndex) {
            this.ResetProps();
        }
        //if not tab apply filter showing data if not shown already
        if (e.keyCode != 9) {
            if (this._dataSliderStatus != 'block') {
                this._dataSliderStatus = 'block';
            }
            if (this._originalDataSet == null && !this._stillDataLoading)
                this.PopulateDataSet(clsGroupIndex);
            this.FilterSource();
        }
        var /** @type {?} */ currentGroupObj = this.selector[clsGroupIndex];
        var /** @type {?} */ codeValue = currentGroupObj.txtCode;
        var /** @type {?} */ descValue = currentGroupObj.txtDesc;
        if (!codeValue && !isLast && !this._codeEmptied) {
            this._codeEmptied = true;
        }
        else
            this._codeEmptied = false;
        if (!descValue && isLast && !this._descEmptied) {
            this._descEmptied = true;
        }
        else
            this._descEmptied = false;
    };
    /**
     * @param {?} e
     * @param {?} clsGroupIndex
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.ClickedOn = function (e, clsGroupIndex) {
        if (this.element.nativeElement.attributes['disabled']) {
            this.enabled = 'false';
            return;
        }
        //V3006Adding start
        if (e.target.attributes['disabled']) {
            return;
        }
        //V3006Adding end
        if (this._currentClsGroupIndex != -1 && this._currentClsGroupIndex != clsGroupIndex) {
            this.ResetProps();
        }
        if (this._dataSliderStatus == 'none') {
            this._dataSliderStatus = 'block';
            this.PopulateDataSet(clsGroupIndex);
        }
        this._cursorInCorD = 'C';
        this.codeInputs.toArray()[this._currentClsGroupIndex].nativeElement.focus();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.pagerClickCapture = function (e) {
        event.preventDefault();
        event.stopPropagation();
    };
    /**
     * @param {?} clsGroupIndex
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.PopulateDataSet = function (clsGroupIndex) {
        var _this = this;
        var /** @type {?} */ masterControlData = JSON.parse(localStorage.getItem('PROMPT_MasterControlData'));
        if (masterControlData)
            this._pageSize = masterControlData.AllowPaging === "1" ? masterControlData.PageSize : masterControlData.ExtendedPageSize;
        this._stillDataLoading = true;
        var /** @type {?} */ headers = new Headers();
        headers.append('Content-Type', 'application/json');
        var /** @type {?} */ APIArgs = JSON.stringify({ selectedIndex: clsGroupIndex, selector: this.selector, activeStatus: this.activeStatus });
        this.http.post(this.siteName() + "/api/Prompt/GetMasterValues", APIArgs, { headers: headers })
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            _this._dataSet = data;
            _this._originalDataSet = data;
        }, function (error) { console.error('this is from classification selector list prompts', error, APIArgs); }, function () { _this._stillDataLoading = false; });
        this._currentClsGroupIndex = clsGroupIndex;
        this.AddEvent();
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.FilterSource = function () {
        var /** @type {?} */ currentFilteration = this.selector[this._currentClsGroupIndex];
        var /** @type {?} */ FilterColumn = '';
        var /** @type {?} */ FilterValue = '';
        if (this._cursorInCorD == 'C') {
            FilterColumn = "MasterGroupValue";
            FilterValue = currentFilteration.txtCode.toString().toUpperCase();
        }
        else {
            FilterColumn = "MasterGroupValueDescription";
            FilterValue = currentFilteration.txtDesc.toString().toUpperCase();
        }
        if (this._originalDataSet != null) {
            this._dataSet = filter(this._originalDataSet, function (row) {
                if (FilterColumn && FilterValue) {
                    return row[FilterColumn].toString().toUpperCase().indexOf(FilterValue) > -1;
                }
                else
                    return true;
            });
            this.scrollDiv.nativeElement.scrollTop = 0;
        }
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.ResetProps = function () {
        this._dataSet = null;
        this._dataSliderStatus = 'none';
        this._dataSet = null;
        this._originalDataSet = null;
        this._currentClsGroupIndex = -1;
        this._codeEmptied = false;
        this._descEmptied = false;
    };
    /**
     * @param {?} item
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.SetModel = function (item) {
        this.promptIndex = this._currentClsGroupIndex;
        if (item) {
            if (this.selector[this._currentClsGroupIndex].txtCode.trim() != item['MasterGroupValue'].trim()) {
                this.clearChildValues();
            }
            this.selector[this._currentClsGroupIndex].txtCode = item['MasterGroupValue'].trim();
            this.selector[this._currentClsGroupIndex].txtDesc = item['MasterGroupValueDescription'].trim();
            this.selector[this._currentClsGroupIndex].LatestText = item['MasterGroupValue'].trim();
            this.selector[this._currentClsGroupIndex].ErrorMessage = undefined;
            if (this.selector[this._currentClsGroupIndex].HierarchyRequired == '1') {
                this.autoFillHirarchy("withActiveStatus");
            }
        }
        else {
            this.selector[this._currentClsGroupIndex].txtCode = '';
            this.selector[this._currentClsGroupIndex].txtDesc = '';
            this.clearChildValues();
        }
        this.onValueChange(this._currentClsGroupIndex);
        this.onChange.emit();
    };
    Object.defineProperty(XontVenturaClassificationSelectorComponent.prototype, "isEmpty", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ currentFilteration = this.selector[this._currentClsGroupIndex];
            var /** @type {?} */ FirstfilterValue = currentFilteration.txtCode;
            var /** @type {?} */ SecondfilterValue = currentFilteration.txtDesc;
            if (this._cursorInCorD == 'C')
                return !FirstfilterValue;
            else if (this._cursorInCorD == 'D')
                return !SecondfilterValue;
            else
                return true;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.AddEvent = function () {
        var /** @type {?} */ self = this;
        /**
         * @param {?} e
         * @return {?}
         */
        function handleClick(e) {
            setTimeout(function () {
                if (!self.element.nativeElement.contains(e.target)) {
                    if (self._dataSliderStatus == 'block') {
                        if (!self.isEmpty) {
                            self.FilterSource();
                            var /** @type {?} */ item = (self._dataSet && self._dataSet.length > 0) ? self._dataSet[0] : null;
                            self.SetModel(item);
                        }
                        else {
                            self.SetModel(null);
                        }
                    }
                    self.ResetProps();
                    window.removeEventListener("click", handleClick);
                }
            }, 0);
        }
        window.removeEventListener("click", handleClick);
        window.addEventListener("click", handleClick);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.ItemSelected = function (item) {
        this.SetModel(item);
        this.ResetProps();
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.ClearModel = function () {
        this.SetModel(null);
        this.FilterSource();
        this.codeInputs.toArray()[this._currentClsGroupIndex].nativeElement.focus();
    };
    Object.defineProperty(XontVenturaClassificationSelectorComponent.prototype, "valid", {
        /**
         * @return {?}
         */
        get: function () {
            if (this._dataSliderStatus == 'block')
                return false;
            else
                return this._valid;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.ngAfterViewInit = function () {
        //this.clsBusy = this.http.get(this.siteName()+"/api/Prompt/GetMasterCodes?ClassificationType="+this.classificationType)
        //    .subscribe(
        //    (data) => {
        //        this.list=data.json();
        //        for(var i=0;i<this.list.length;i++){
        //            // var error=undefined;
        //            // if(this.allMandatory=='true'){
        //            //     error='*'
        //            // }
        //            // if(this.lastLevelRequired=='true' && i==(this.list.length-1)){
        //            //     error='*';
        //            // }
        //            var obj={index:i,
        //                txtCode:'',
        //                txtDesc:'',
        //                GroupDescription:this.list[i].GroupDescription.trim(),
        //                HierarchyRequired:this.list[i].HierarchyRequired.trim(),
        //                MasterGroup:this.list[i].MasterGroup.trim(),
        //                ErrorMessage:undefined,
        //                LatestText:''
        //            };
        //            this.selector.push(obj);
        //        }
        //        if(this.selectedClassifications.length>0){
        //            this.applySelectedClassifications(this.selectedClassifications);
        //        }
        //        this.validate();
        //    },
        //    (err) => {
        //        console.log(err.json());
        //    },
        //    () => console.log("observable complete")
        //    );
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.clearChildValues = function () {
        //V3001Adding start
        if (this.promptIndex < this.selector.length - 1 && this.selector[this.promptIndex + 1].HierarchyRequired == '1') {
            for (var /** @type {?} */ i = (this.promptIndex + 1); i < this.selector.length; i++) {
                if (this.selector[i].HierarchyRequired == '1') {
                    this.selector[i].txtCode = '';
                    this.selector[i].txtDesc = '';
                    this.selector[i].LatestText = '';
                }
            }
        }
        //V3001Adding end
        //V3001Removed start
        //if (this.selector[this.promptIndex].HierarchyRequired == '1') {
        //    for (var i = (this.promptIndex + 1); i < this.selector.length; i++) {
        //        this.selector[i].txtCode = '';
        //        this.selector[i].txtDesc = '';
        //        this.selector[i].LatestText = '';
        //    }
        //}
        //V3001Removed end
    };
    /**
     * @param {?} type
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.autoFillHirarchy = function (type) {
        var _this = this;
        var /** @type {?} */ apiUrl = this.siteName() + "/api/Prompt/GetMasterGroupValuesHirarchy?MasterGroup=" + this.selector[this.promptIndex].MasterGroup + "&Code=" + this.selector[this.promptIndex].txtCode.trim();
        if (type == 'withActiveStatus') {
            apiUrl = apiUrl + "&ActiveStatus=" + this.activeStatus;
        }
        this.clsBusy = this.http.get(apiUrl)
            .subscribe(function (data) {
            var /** @type {?} */ groupValuesHirarchy = data.json();
            for (var /** @type {?} */ i = 0; i < _this.selector.length; i++) {
                var /** @type {?} */ obj1 = _this.getMasterGroupObj(groupValuesHirarchy, _this.selector[i].MasterGroup.toString());
                if (obj1 != null) {
                    _this.selector[i].txtCode = obj1['MasterGroupValue'].trim();
                    _this.selector[i].txtDesc = obj1['MasterGroupValueDescription'].trim();
                    _this.selector[i].ErrorMessage = undefined;
                    _this.selector[i].LatestText = obj1['MasterGroupValue'].trim();
                }
                else {
                    _this.selector[i].txtCode = '';
                    _this.selector[i].txtDesc = '';
                    _this.selector[i].LatestText = '';
                }
            }
            _this.validate();
        }, function (err) {
            console.log(err.json());
        }, function () { return console.log("observable complete"); });
    };
    /**
     * @param {?} array
     * @param {?} masterGroup
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.getMasterGroupObj = function (array, masterGroup) {
        for (var /** @type {?} */ i = 0; i < array.length; i++) {
            if (array[i].MasterGroup.trim() == masterGroup.trim()) {
                return array[i];
            }
        }
        return null;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.onValueChange = function (index) {
        if (this.allMandatory == 'true') {
            if (this.selector[index].txtCode == '') {
                this.selector[index].ErrorMessage = '*';
            }
            else {
                this.selector[index].ErrorMessage = undefined;
            }
        }
        if (this.lastLevelRequired == 'true') {
            if (index == (this.selector.length - 1)) {
                if (this.selector[index].txtCode == '') {
                    this.selector[index].ErrorMessage = '*';
                }
                else {
                    this.selector[index].ErrorMessage = undefined;
                }
            }
        }
        this.validate();
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.validate = function () {
        for (var /** @type {?} */ i = 0; i < this.selector.length; i++) {
            if (this.allMandatory == 'true') {
                if (this.selector[i].txtCode.trim() == '') {
                    this.selector[i].ErrorMessage = '*';
                }
                else {
                    this.selector[i].ErrorMessage = undefined;
                }
            }
            else {
                if (this.selector[i].txtCode.trim() == '') {
                    this.selector[i].ErrorMessage = undefined;
                }
            }
        }
        if (this.lastLevelRequired == 'true') {
            var /** @type {?} */ last = this.selector.length - 1;
            if (this.selector[last].txtCode == '') {
                this.selector[last].ErrorMessage = '*';
            }
            else if (this.selector[last].txtCode != '' && this.selector[last].ErrorMessage != undefined) {
            }
            else {
                this.selector[last].ErrorMessage = undefined;
            }
        }
        for (var /** @type {?} */ j = 0; j < this.selector.length; j++) {
            if (this.selector[j].ErrorMessage != undefined) {
                //this.valid = false;V3001Removed
                this._valid = false; //V3001Added
                return;
            }
        }
        //this.valid = true;V3001Removed
        this._valid = true; //V3001Added
        return;
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.getSelectedClassifications = function () {
        var /** @type {?} */ result = [];
        for (var /** @type {?} */ i = 0; i < this.selector.length; i++) {
            if (this.selector[i].txtCode.trim() != '') {
                result.push({
                    Index: i,
                    GroupCode: this.list[i].MasterGroup.trim(),
                    GroupDescription: this.list[i].GroupDescription.trim(),
                    GroupType: this.list[i].GroupType.trim(),
                    GroupTypeDescription: this.list[i].GroupType.trim(),
                    HasHirarchy: this.list[i].HierarchyRequired.trim(),
                    ValueCode: this.selector[i].txtCode.trim(),
                    ValueDescription: this.selector[i].txtDesc.trim()
                });
            }
            // else{
            //     return result;
            // }
        }
        //
        if (result.length == 0) {
            if (this.selectedClassifications.length > 0) {
                result = this.selectedClassifications;
            }
        }
        //
        return result;
    };
    /**
     * @param {?} array
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.setSelectedClassifications = function (array) {
        if (array) {
            this.selectedClassifications = array;
            this.applySelectedClassifications(array);
        }
    };
    /**
     * @param {?} array
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.applySelectedClassifications = function (array) {
        this.cleanSelector();
        for (var /** @type {?} */ i = 0; i < array.length; i++) {
            for (var /** @type {?} */ j = 0; j < this.selector.length; j++) {
                if (this.selector[j].MasterGroup.trim() == array[i].GroupCode.trim()) {
                    this.selector[j].txtCode = array[i].ValueCode.trim();
                    this.selector[j].txtDesc = array[i].ValueDescription.trim();
                    this.selector[j].LatestText = '';
                }
            }
        }
        this.validate();
    };
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorComponent.prototype.cleanSelector = function () {
        ///clear selector
        for (var /** @type {?} */ i = 0; i < this.selector.length; i++) {
            this.selector[i].txtCode = '';
            this.selector[i].txtDesc = '';
            this.selector[i].ErrorMessage = undefined;
            this.selector[i].LatestText = '';
        }
        ///
    };
    return XontVenturaClassificationSelectorComponent;
}());
XontVenturaClassificationSelectorComponent.decorators = [
    { type: Component, args: [{
                selector: 'xont-ventura-classification-selector',
                styles: [
                    '.selectedRow {background-color: rgb(102, 153, 153);}',
                    ".dataSlider {\n        position: absolute;\n        min-height:307px;\n        border-radius: 0 7px 7px 7px;\n        background-color:white;\n        margin-top: 3px;\n        margin-bottom:15px;\n        z-index:1000;\n        border: 1.5px #5399d6 solid;\n        padding-left: 5px;\n        color: #01539D;\n        font-family: Trebuchet MS;\n        background-color:ghostwhite;\n        }",
                    '.dtRow { cursor:pointer; }',
                    '.dtRow > td {padding-right:10px;}',
                    '.dtRow:hover {color:red;}',
                    '.pmtPaginator { position:absolute; bottom:4px; border:2px solid #006699; border-radius:6px;}',
                    '.sliderLoader {height: 80px; margin: auto; display: block; margin-top: 80px;}',
                    '.clickButton {padding-left:8.75px;font-size:16px;padding-right:8.75px;cursor:pointer;display:inline-block;}',
                    '.scrollDiv { overflow: auto; overflow-x: hidden; padding-left:10px; margin:8px 5px 5px 0;}',
                    '.closeI {font-size:18px;cursor:pointer;color:#006699;vertical-align:middle;}',
                    '.disabledInput {background-color: rgba(170, 170, 170, 0.19);}',
                    '.Textboxstyle[disabled] {background-color: rgba(170, 170, 170, 0.19);}',
                    '.clickButtonDisabled {padding-left:8.75px;font-size:16px;padding-right:8.75px;display:inline-block;}',
                    '.tableStyles tbody td { padding: 2.5px 0 2.5px 3.5px;border: 1px solid #AAAAAA;background:white;font-size:small;font-family:Trebuchet MS;font-size:13px;}',
                    '.tableStyles th {padding: 2.5px 0 2.5px 3.5px;font-family:Trebuchet MS; font-size:13px;margin-left:10px;margin-top:4px; background-color: #006699;color: #ffffff;}',
                    '.tableStyles th:hover {text-decoration:underline;cursor:pointer;}',
                    '.sortIcon {padding-left:7px;}',
                    '.pmtPaginator > span {padding-left:5px;padding-right:5px;}',
                    '#element {position:relative;display:inline-block;margin-bottom:-5px;}',
                    '.Textboxstyle  { padding-left:2px;}',
                    '.clsTable td {padding: 0 0 2px 0;}',
                    '.clsErrormessagetextstyle {position:absolute;margin-left:1px;top:-14px;left:1px;color:#e50505;font-family:Trebuchet MS;font-size:20px;font-style:normal;}',
                    '.clsMandatoryCurrent {top:-14px;left:22px;}',
                    'clsTable[disabled] input[type="text"] {background-color: rgba(170, 170, 170, 0.19);}'
                ],
                template: "<div #element id='element'>\n        \n        <table class='clsTable'>\n        <tr *ngFor=\"let row of selector\">\n            <td><div [style.width]=\"labelWidth\" class='Captionstyle'>{{row.GroupDescription}}</div></td>\n            <td>\n                <input #codeInput attr.id=\"{{id}}txtCode{{row.index}}\" [disabled]=\"enabled=='false'\" autocomplete=\"off\"\n                    [(ngModel)]=\"row.txtCode\" [style.width]=\"codeTextWidth\" type=\"text\" class=\"Textboxstyle\"  \n                    (mousedown)=\"InputMousedIn($event, false, row.index)\"\n                    (keyup)=\"InputKeyUp($event, false, row.index)\" \n                    (keydown)=\"InputKeyDown($event, false, row.index)\"\n                    (focus)=InputFocus()>\n            </td>\n            <td>\n            <span>\n                <span type=\"button\" title=\"Master Group - {{row.MasterGroup}}\" (click)=\"ClickedOn($event, row.index)\" *ngIf=\"enabled=='true'\" class=\"fa fa-angle-double-down clickButton\" aria-hidden=\"true\"></span>\n                <span type=\"button\" title=\"Master Group - {{row.MasterGroup}}\" class=\"fa fa-angle-double-down clickButtonDisabled\" *ngIf=\"enabled == 'false'\" aria-hidden=\"true\"></span>\n            </span>\n            </td>\n            <td>\n                <input #descInput attr.id=\"{{id}}txtDesc{{row.index}}\" [(ngModel)]=\"row.txtDesc\" type=\"text\" autocomplete=\"off\"\n                    [style.width]=\"descriptionTextWidth\" class=\"Textboxstyle\" [disabled]=\"enabled == 'false'\"\n                    (mousedown)=\"InputMousedIn($event, true, row.index)\"\n                    (keyup)=\"InputKeyUp($event, true, row.index)\" \n                    (keydown)=\"InputKeyDown($event, true, row.index)\"\n                    (focus)=InputFocus()>\n            </td>\n            <td style=\"padding-left:2px;\">\n                <span style=\"position:relative;display:inline-block;\">\n                    <span *ngIf=\"row.ErrorMessage\" [class.clsMandatoryCurrent]=\"row.index == _currentClsGroupIndex\" class=\"clsErrormessagetextstyle\">{{row.ErrorMessage}}</span>\n                </span>\n                <i class=\"fa fa-times-circle closeI\" *ngIf=\"_dataSliderStatus == 'block' && row.index == _currentClsGroupIndex\" title=\"clear code/description\" (click)=\"ClearModel(row.index)\"></i>\n            </td>\n        </tr>\n    </table>\n\n    <div class=\"dataSlider\" [style.left]=\"labelWidth\" [style.top]=\"(24 *_currentClsGroupIndex + 21) + 'px'\" [style.display]=\"_dataSliderStatus\" [style.minWidth]=\"_minWidth + 60 + 'px'\">\n        <div *ngIf=\"_dataSet == null\">\n            <img *ngIf=\"_dataSet == null\" class=\"sliderLoader\" src='../App_Themes_V3/Blue/images/load_pmt.gif' />\n        </div>\n\n        <div #scrollDiv [style.height]=\"_dataSet?.length > _pageSize ? '260px' : '275px'\" class=\"scrollDiv\" *ngIf=\"!_stillDataLoading\">\n            <table [mfRowsOnPage]=\"_pageSize\" [style.minWidth]=\"_minWidth + 20 + 'px'\" [mfData]=\"_dataSet\" #mf=\"mfDataTable\"\n                    class=\"tableStyles\">\n                <thead>\n                    <tr>\n                        <th *ngFor=\"let header of _gridHeaders let gridHeaderIndex = index\">\n                            <mfDefaultSorter [by]=\"_gridFields[gridHeaderIndex]\">{{header}}</mfDefaultSorter>\n                        </th>\n                    </tr>\n                </thead>\n\n                <tbody>\n                    <tr *ngFor=\"let item of mf.data\" class=\"dtRow\" (click)=\"ItemSelected(item)\">\n                        <td *ngFor=\"let field of _gridFields let fieldIndex = index\">{{item[field].toString().trim()}}</td>\n                    </tr>\n                </tbody>\n                <tfoot>\n                    <div *ngIf=\"_dataSet?.length > _pageSize || _dataSet?.length == 0\">\n                        <div class=\"pmtPaginator\" (click)=\"pagerClickCapture($event)\" *ngIf=\"_dataSet?.length > _pageSize\">\n                            <mfBootstrapPaginator></mfBootstrapPaginator>\n                        </div>\n                        <div class=\"pmtPaginator\" *ngIf=\"_dataSet?.length == 0\">\n                            <span>No Data Found to Display</span>\n                        </div>\n                    </div>\n\n                </tfoot>\n            </table>\n        </div>\n</div>\n</div>"
            },] },
];
/**
 * @nocollapse
 */
XontVenturaClassificationSelectorComponent.ctorParameters = function () { return [
    { type: Http, },
    { type: Location, },
    { type: CommonService, },
]; };
XontVenturaClassificationSelectorComponent.propDecorators = {
    'element': [{ type: ViewChild, args: ['element',] },],
    'scrollDiv': [{ type: ViewChild, args: ['scrollDiv',] },],
    'codeInputs': [{ type: ViewChildren, args: ['codeInput',] },],
    'descInputs': [{ type: ViewChildren, args: ['descInput',] },],
    'id': [{ type: Input },],
    'classificationType': [{ type: Input },],
    'taskCode': [{ type: Input },],
    'codeTextWidth': [{ type: Input },],
    'enableUserInput': [{ type: Input },],
    'descriptionTextWidth': [{ type: Input },],
    'labelWidth': [{ type: Input },],
    'activeStatus': [{ type: Input },],
    'allMandatory': [{ type: Input },],
    'lastLevelRequired': [{ type: Input },],
    'enabled': [{ type: Input },],
    'onChange': [{ type: Output },],
};

var XontVenturaClassificationSelectorModule = (function () {
    function XontVenturaClassificationSelectorModule() {
    }
    /**
     * @return {?}
     */
    XontVenturaClassificationSelectorModule.forRoot = function () {
        return {
            ngModule: XontVenturaClassificationSelectorModule
        };
    };
    return XontVenturaClassificationSelectorModule;
}());
XontVenturaClassificationSelectorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule, FormsModule, BrowserAnimationsModule, BusyModule, DataTableModule
                ],
                declarations: [
                    XontVenturaClassificationSelectorComponent,
                    XontVenturaTranslateDirective
                ],
                exports: [
                    XontVenturaClassificationSelectorComponent
                ],
                providers: [CommonService, XontVenturaCaptionTranslateService],
            },] },
];
/**
 * @nocollapse
 */
XontVenturaClassificationSelectorModule.ctorParameters = function () { return []; };

export { XontVenturaClassificationSelectorModule, XontVenturaClassificationSelectorComponent };
