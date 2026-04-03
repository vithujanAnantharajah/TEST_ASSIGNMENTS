(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/http'), require('rxjs/add/operator/map'), require('rxjs/add/operator/catch'), require('xont-ventura-services'), require('rxjs/Rx'), require('angular2-busy')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/http', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'xont-ventura-services', 'rxjs/Rx', 'angular2-busy'], factory) :
	(factory((global['xont-ventura-message-prompt'] = {}),global._angular_core,global._angular_common,global._angular_http,null,null,global.xontVenturaServices,global.rxjs_Rx,global.angular2Busy));
}(this, (function (exports,_angular_core,_angular_common,_angular_http,rxjs_add_operator_map,rxjs_add_operator_catch,xontVenturaServices,rxjs_Rx,angular2Busy) { 'use strict';

var MessageService = (function () {
    /**
     * @param {?} http
     * @param {?} commonService
     */
    function MessageService(http, commonService) {
        this.http = http;
        this.commonService = commonService;
    }
    /**
     * @param {?} msgID
     * @return {?}
     */
    MessageService.prototype.getMessage = function (msgID) {
        return this.http.get(this.getSiteName() + '/api/Message/GetMessage?msgID=' + msgID)
            .map(function (response) { return response.json(); })
            .catch(function (error) { return rxjs_Rx.Observable.throw(error.json()); });
    };
    /**
     * @return {?}
     */
    MessageService.prototype.getUserName = function () {
        return this.http.get(this.getSiteName() + '/api/Message/GetUserName')
            .map(function (response) { return response.json(); })
            .catch(function (error) { return rxjs_Rx.Observable.throw(error.json()); });
    };
    /**
     * @return {?}
     */
    MessageService.prototype.getSiteName = function () {
        return this.commonService.getAPIPrefix();
    };
    return MessageService;
}());
MessageService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
MessageService.ctorParameters = function () { return [
    { type: _angular_http.Http, },
    { type: xontVenturaServices.CommonService, },
]; };

var XontVenturaMessagePromptComponent = (function () {
    /**
     * @param {?} http
     * @param {?} location
     * @param {?} messageService
     */
    function XontVenturaMessagePromptComponent(http, location, messageService) {
        this.http = http;
        this.location = location;
        this.messageService = messageService;
        this.message = {};
        this.backgroundColor = "";
        this.title = "";
        this.messageText = "";
        //V3001
        //okButtonText="OK";
        //cancelButtonText="Cancel";
        this.okButtonText = "Yes";
        this.cancelButtonText = "No";
        //V3001
        this.id = 'errorMessagePromptID';
        this.messageType = 'error';
        this.onOK = new _angular_core.EventEmitter();
        this.onCancel = new _angular_core.EventEmitter();
    }
    /**
     * @param {?} object
     * @param {?} taskCode
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.show = function (object, taskCode) {
        var _this = this;
        var /** @type {?} */ date = new Date(object.ErrorTime);
        var /** @type {?} */ month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        var /** @type {?} */ day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        var /** @type {?} */ hour = date.getHours();
        if (hour > 12) {
            hour = hour - 12;
        }
        object.ErrorTime = date.getFullYear() + '/' + month + '/' + day + '   ' + (hour < 10 ? '0' : '') + hour + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds() + ' ' + (date.getHours() >= 12 ? 'PM' : 'AM');
        if (object.ErrorType == 1) {
            //this.http.get(this.siteName()+"/api/Prompt/GetCurrentUser")    //V3001
            this.busy = this.messageService.getUserName() //V3001
                .subscribe(function (data) {
                //object.UserName=data.json()['<UserName>k__BackingField'];    //V3001
                object.UserName = data; //V3001
            }, function (err) {
                console.log(err);
            }, function () {
                _this.message = object;
                $('#' + _this.id).modal({ backdrop: "static" });
            });
        }
        else {
            this.message = object;
            $('#' + this.id).modal({ backdrop: "static" });
        }
    };
    /**
     * @param {?} messageText
     * @param {?} okButtonText
     * @param {?} cancelButtonText
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.showConfirm = function (messageText, okButtonText, cancelButtonText) {
        this.messageText = messageText;
        this.okButtonText = okButtonText;
        this.cancelButtonText = cancelButtonText;
        $('#' + this.id).modal({ backdrop: "static" });
    };
    /**
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.confirm_ok = function () {
        $('#' + this.id).modal('hide');
        this.onOK.emit();
    };
    /**
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.confirm_cancel = function () {
        $('#' + this.id).modal('hide');
        this.onCancel.emit();
    };
    /**
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.alert_ok = function () {
        $('#' + this.id).modal('hide');
        this.onOK.emit();
    };
    /**
     * @param {?} messageText
     * @param {?} okButtonText
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.showAlert = function (messageText, okButtonText) {
        this.messageText = messageText;
        this.okButtonText = okButtonText;
        $('#' + this.id).modal({ backdrop: "static" });
    };
    /**
     * @param {?} msgID
     * @param {?=} para1
     * @param {?=} para2
     * @param {?=} para3
     * @param {?=} para4
     * @param {?=} para5
     * @param {?=} para6
     * @param {?=} yesButtonText
     * @param {?=} noButtonText
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.confirmation = function (msgID, para1, para2, para3, para4, para5, para6, yesButtonText, noButtonText) {
        var _this = this;
        if (yesButtonText)
            this.okButtonText = yesButtonText.trim();
        if (noButtonText)
            this.cancelButtonText = noButtonText.trim();
        var /** @type {?} */ msg = "Message " + msgID + " Does not contain in Message DataBase";
        this.busy = this.messageService.getMessage(msgID)
            .subscribe(function (data) {
            if (data[0]) {
                msg = data[0].MessageText.trim();
                //V3003
                if (para1 != null && para1.trim() != "")
                    msg = msg.replace("&1", para1.trim());
                if (para2 != null && para2.trim() != "")
                    msg = msg.replace("&2", para2.trim());
                if (para3 != null && para3.trim() != "")
                    msg = msg.replace("&3", para3.trim());
                if (para4 != null && para4.trim() != "")
                    msg = msg.replace("&4", para4.trim());
                if (para5 != null && para5.trim() != "")
                    msg = msg.replace("&5", para5.trim());
                if (para6 != null && para6.trim() != "")
                    msg = msg.replace("&6", para6.trim());
                //V3003
            }
            _this.messageText = msg;
            $('#' + _this.id).modal({ backdrop: "static" });
        }, function (err) {
            console.log(err);
        });
    };
    /**
     * @param {?} msgID
     * @param {?} para1
     * @param {?} para2
     * @param {?} para3
     * @param {?} para4
     * @param {?} para5
     * @param {?} para6
     * @return {?}
     */
    XontVenturaMessagePromptComponent.prototype.alert = function (msgID, para1, para2, para3, para4, para5, para6) {
        var _this = this;
        this.okButtonText = "OK";
        var /** @type {?} */ msg = "Message " + msgID + " Does not contain in Message DataBase";
        this.busy = this.messageService.getMessage(msgID)
            .subscribe(function (data) {
            if (data[0]) {
                msg = data[0].MessageText.trim();
                if (para1.trim() != "")
                    msg = msg.replace("&1", para1.trim());
                if (para2.trim() != "")
                    msg = msg.replace("&2", para2.trim());
                if (para3.trim() != "")
                    msg = msg.replace("&3", para3.trim());
                if (para4.trim() != "")
                    msg = msg.replace("&4", para4.trim());
                if (para5.trim() != "")
                    msg = msg.replace("&5", para5.trim());
                if (para6.trim() != "")
                    msg = msg.replace("&6", para6.trim());
            }
            _this.messageText = msg;
            $('#' + _this.id).modal({ backdrop: "static" });
        }, function (err) {
            console.log(err);
        });
    };
    return XontVenturaMessagePromptComponent;
}());
//V3001
XontVenturaMessagePromptComponent.decorators = [
    { type: _angular_core.Component, args: [{
                providers: [MessageService],
                selector: 'xont-ventura-message-prompt',
                template: "  \n    <div [ngBusy]=\"busy\"></div>\n    <!-- Modal -->\n    <div *ngIf=\"messageType=='confirm'\" class=\"modal fade\" id=\"{{id}}\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\">\n      <!-- Modal content-->\n      <div class=\"modal-content\">\n        \n        <div class=\"modal-body Captionstyle\" style=\"text-align: center;\" >\n          <p>{{messageText}}</p>\n        </div>\n        \n          <div class=\"text-center\">\n           <button type=\"button\" class=\"MainButtonStyle\" (click)=\"confirm_ok()\" >{{okButtonText}}</button>\n            <button type=\"button\" class=\"MainButtonStyle\" (click)=\"confirm_cancel()\" >{{cancelButtonText}}</button>\n          </div>\n           \n         \n      </div>\n      \n    </div>\n  </div>\n\n  <div *ngIf=\"messageType=='alert'\" class=\"modal fade\" id=\"{{id}}\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\">\n      <!-- Modal content-->\n      <div class=\"modal-content\">\n        \n        <div class=\"modal-body Captionstyle\" style=\"text-align: center;\">\n          <p>{{messageText}}</p>\n        </div>\n        <div class=\"text-center\">\n            <button type=\"button\" class=\"MainButtonStyle\" (click)=\"alert_ok()\" >{{okButtonText}}</button>\n         </div>\n      </div>\n      \n    </div>\n  </div>\n\n  <!-- Modal -->\n<div *ngIf=\"messageType=='error'\" class=\"modal fade\" id=\"{{id}}\" role=\"dialog\">\n\n    <div class=\"modal-dialog\" [ngClass]=\"{'modal-sm':message.ErrorType==2}\">\n\n\n            <div class=\"modal-content\" >\n\n                <div  *ngIf=\"message.ErrorType==1\" class=\"modal-header\" style=\"padding:10px 10px 10px 20px;background-color:crimson !important;\">\n                    <h5 class=\"modal-title\" style=\"font-size: 12px;\">Error Message </h5>\n                </div>\n\n                <div  *ngIf=\"message.ErrorType==1\" class=\"modal-body \" style=\"background-color: #383838;color:white;font-size: 12px;\">\n                    <table>\n                        <tr>\n                            <td style=\"padding-right:50px\">Error Log Number </td>\n                            <td>: &nbsp; {{message.ErrorLog}}</td>\n                        </tr>\n                        <tr>\n                            <td>Error Time </td>\n                            <td>: &nbsp; {{message.ErrorTime}}</td>\n                        </tr>\n                        <tr>\n                            <td>WorkStation </td>\n                            <td>: &nbsp; {{message.WorkstationId}}</td>\n                        </tr>\n                        <tr>\n                            <td>User Name </td>\n                            <td>: &nbsp; {{message.UserName}} </td>\n                        </tr>\n                        <tr>\n                            <td>IP Address </td>\n                            <td>: &nbsp; {{message.IpAddress}}</td>\n                        </tr>\n                        <tr>\n                            <td>Message Number </td>\n                            <td>: &nbsp; {{message.MsgNumber}}</td>\n                        </tr>\n                        <tr>\n                            <td>Error Description </td>\n                            <td>: &nbsp; {{message.Desc}}</td>\n                        </tr>\n                        <tr>\n                            <td>Error Source </td>\n                            <td>: &nbsp; {{message.ErrorSource}}</td>\n                        </tr>\n                        <tr>\n                            <td>DLL Name </td>\n                            <td>: &nbsp;{{message.DllName}}</td>\n                        </tr>\n                        <tr>\n                            <td>Version </td>\n                            <td>: &nbsp; {{message.Version}}</td>\n                        </tr>\n                        <tr>\n                            <td>Routine </td>\n                            <td>: &nbsp; {{message.Routine}}</td>\n                        </tr>\n                        <tr>\n                            <td>Error Line Number </td>\n                            <td>: &nbsp; {{message.LineNumber}}</td>\n                        </tr>\n                    </table>\n                </div>\n\n                <div  *ngIf=\"message.ErrorType==1\" class=\"modal-footer\" style=\"padding:5px 20px 5px 5px;background-color: crimson;\">\n                    <button type=\"button\" class=\"btn btn-default btn-sm\" data-dismiss=\"modal\">OK</button>\n                </div>\n                \n                <div class=\"modal-body Captionstyle\" style=\"text-align: center;\" *ngIf=\"message.ErrorType==2\">\n                    <p>{{message.MsgNumber}} : &nbsp; {{message.Desc}}</p>\n                </div>\n                <div class=\"text-center\" *ngIf=\"message.ErrorType==2\">\n                    <button type=\"button\" class=\"MainButtonStyle\" data-dismiss=\"modal\">OK</button>\n                </div>\n\n            </div>\n\n\n  </div>\n</div>\n"
            },] },
];
/**
 * @nocollapse
 */
XontVenturaMessagePromptComponent.ctorParameters = function () { return [
    { type: _angular_http.Http, },
    { type: _angular_common.Location, },
    { type: MessageService, },
]; };
XontVenturaMessagePromptComponent.propDecorators = {
    'id': [{ type: _angular_core.Input },],
    'messageType': [{ type: _angular_core.Input },],
    'onOK': [{ type: _angular_core.Output },],
    'onCancel': [{ type: _angular_core.Output },],
};

var XontVenturaCaptionTranslateService = (function () {
    /**
     * @param {?} http
     * @param {?} commonService
     */
    function XontVenturaCaptionTranslateService(http, commonService) {
        this.http = http;
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
            .catch(function (error) { return rxjs_Rx.Observable.throw(error.json()); });
    };
    /**
     * @param {?} caption
     * @return {?}
     */
    XontVenturaCaptionTranslateService.prototype.UpdateCaption = function (caption) {
        var /** @type {?} */ headers = new _angular_http.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.GetApiPrefix() + "/api/CaptionTranslate/UpdateCaption", caption, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return rxjs_Rx.Observable.throw(error.json()); });
    };
    return XontVenturaCaptionTranslateService;
}());
XontVenturaCaptionTranslateService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
XontVenturaCaptionTranslateService.ctorParameters = function () { return [
    { type: _angular_http.Http, },
    { type: xontVenturaServices.CommonService, },
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
    { type: _angular_core.Directive, args: [{
                selector: 'div.Captionstyle, span.Captionstyle, label, legend, span.Errormessagetextstyle, button.MainButtonStyle, a.tabLink'
            },] },
];
/**
 * @nocollapse
 */
XontVenturaTranslateDirective.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: XontVenturaCaptionTranslateService, },
]; };
XontVenturaTranslateDirective.propDecorators = {
    'onclick': [{ type: _angular_core.HostListener, args: ['click',] },],
};

var XontVenturaTaskNotificationService = (function () {
    /**
     * @param {?} http
     * @param {?} commonService
     */
    function XontVenturaTaskNotificationService(http, commonService) {
        this.http = http;
        this.commonService = commonService;
    }
    /**
     * @return {?}
     */
    XontVenturaTaskNotificationService.prototype.GetApiPrefix = function () {
        return this.commonService.getAPIPrefix();
    };
    /**
     * @param {?} taskCode
     * @return {?}
     */
    XontVenturaTaskNotificationService.prototype.CreateUserNotification = function (taskCode) {
        var /** @type {?} */ headers = new _angular_http.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.GetApiPrefix() + "/api/CustomControl/CreateUserNotification", { taskCode: taskCode }, { headers: headers })
            .map(function (response) { return response.json(); })
            .catch(function (error) { return rxjs_Rx.Observable.throw(error.json()); });
    };
    return XontVenturaTaskNotificationService;
}());
XontVenturaTaskNotificationService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
XontVenturaTaskNotificationService.ctorParameters = function () { return [
    { type: _angular_http.Http, },
    { type: xontVenturaServices.CommonService, },
]; };

var XontVenturaTaskNotificationDirective = (function () {
    /**
     * @param {?} _service
     */
    function XontVenturaTaskNotificationDirective(_service) {
        this._service = _service;
    }
    /**
     * @return {?}
     */
    XontVenturaTaskNotificationDirective.prototype.onclick = function () {
        //if not already updated the table proceed.
        if (!XontVenturaTaskNotificationDirective.NOTIFIED) {
            var /** @type {?} */ currentTask;
            var /** @type {?} */ currentTaskElement = window.parent.document.getElementById('txtCurrentTaskCode');
            if (currentTaskElement) {
                currentTask = currentTaskElement.value;
            }
            //if current task is empty this means the component is running on debug mode
            if (!!currentTask) {
                console.log('task notification is gonna be created for', currentTask);
                var /** @type {?} */ keyOfCurrent = currentTask + '_ShouldNotify';
                if (localStorage.getItem(keyOfCurrent)) {
                    var /** @type {?} */ shouldNotify = JSON.parse(localStorage.getItem(keyOfCurrent));
                    if (shouldNotify) {
                        this._service.CreateUserNotification(currentTask).subscribe(function (isUpdated) {
                            if (isUpdated) {
                                XontVenturaTaskNotificationDirective.NOTIFIED = true;
                                var /** @type {?} */ wrapperDiv_1 = document.createElement('div');
                                wrapperDiv_1.id = "translatorNotPermittedDiv"; //using previously created CSS class
                                wrapperDiv_1.innerText = 'Notification was created.';
                                wrapperDiv_1.classList.add("Captionstyle");
                                document.getElementsByTagName("body")[0].appendChild(wrapperDiv_1);
                                var /** @type {?} */ opacity_1 = 1;
                                var /** @type {?} */ fadeEffect = setInterval(function () {
                                    if (opacity_1 > 0) {
                                        opacity_1 -= 0.08;
                                        wrapperDiv_1.style.opacity = opacity_1.toString();
                                    }
                                    else {
                                        clearInterval(fadeEffect);
                                        wrapperDiv_1.parentElement.removeChild(wrapperDiv_1);
                                    }
                                }, 200);
                            }
                        }, function (error) { console.error('error happned in task notification service ', error, 'here goes the taskcode', currentTask); });
                    }
                }
            }
        }
    };
    return XontVenturaTaskNotificationDirective;
}());
XontVenturaTaskNotificationDirective.NOTIFIED = false;
XontVenturaTaskNotificationDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[id="btnOK"],[id="btnOk"],[id="btnSave"],[id="btnUpdate"],[id="btnConfirm"],[id="btnYes"]'
            },] },
];
/**
 * @nocollapse
 */
XontVenturaTaskNotificationDirective.ctorParameters = function () { return [
    { type: XontVenturaTaskNotificationService, },
]; };
XontVenturaTaskNotificationDirective.propDecorators = {
    'onclick': [{ type: _angular_core.HostListener, args: ['click',] },],
};

var XontVenturaMessagePromptModule = (function () {
    function XontVenturaMessagePromptModule() {
    }
    /**
     * @return {?}
     */
    XontVenturaMessagePromptModule.forRoot = function () {
        return {
            ngModule: XontVenturaMessagePromptModule,
            providers: [MessageService] //V3001
        };
    };
    return XontVenturaMessagePromptModule;
}());
XontVenturaMessagePromptModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule, angular2Busy.BusyModule
                ],
                declarations: [
                    XontVenturaMessagePromptComponent,
                    XontVenturaTranslateDirective //V3002Added
                    ,
                    XontVenturaTaskNotificationDirective //V3004Added
                ],
                exports: [
                    XontVenturaMessagePromptComponent,
                    XontVenturaTranslateDirective //V3002Added
                    ,
                    XontVenturaTaskNotificationDirective //V3004Added    
                ],
                providers: [
                    xontVenturaServices.CommonService,
                    XontVenturaCaptionTranslateService //V3002Added
                    ,
                    XontVenturaTaskNotificationService //V3004Added
                ],
            },] },
];
/**
 * @nocollapse
 */
XontVenturaMessagePromptModule.ctorParameters = function () { return []; };

exports.XontVenturaMessagePromptModule = XontVenturaMessagePromptModule;
exports.XontVenturaMessagePromptComponent = XontVenturaMessagePromptComponent;
exports.MessageService = MessageService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
