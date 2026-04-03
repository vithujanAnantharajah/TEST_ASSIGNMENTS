import { Injectable } from '@angular/core';
import { ListComponent } from './list.component/list.component';
import { NewComponent } from './new.component/new.component';
import { CommonService, DatetimeService } from 'xont-ventura-services';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { Http, Headers } from "@angular/http";

@Injectable()
export class ReturnTypeService {
    constructor(private http: Http, private commonService: CommonService, private datetimeService: DatetimeService) {

    }

    private componentMethodCallSource = new Subject<any>();
    componentMethodCalled$ = this.componentMethodCallSource.asObservable();

    public handleError(error: any) {
        this.componentMethodCallSource.next(error);
        return Observable.throw(error);
    }

    public getSiteName(): string {
        return this.commonService.getAPIPrefix('SOMNT24');
    }

   //Get Module Data for list prompt
    public GetModulePromptData() {
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetModulePromptData')
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    //Get Module Data for New prompt
    public GetModulePromptDataForNew() {
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetModulePromptDataForNew')
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }
    
    //Get MoCategory Prompt Data
    public GetCategoryPromptData() {
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetCategoryPromptData')
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    //List Data
    public ListReturnTypeData(selectionCriteria: any) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.getSiteName() + '/api/SOMNT24/ListReturnTypeData', (selectionCriteria), { headers: headers })
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    //get Selected Returntype Data Item
    public SeletedReturnType(moduleCode, returnType) {
        return this.http.get(this.getSiteName() + '/api/SOMNT24/SeletedReturnType?moduleCode=' + moduleCode + '&returnType=' + returnType)
            .map(response => response.json())
            .catch(error => this.handleError(error))
    }

    //Insert or Update ReturnType
    public InsertReturnType(formData: any) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.getSiteName() + '/api/SOMNT24/InsertReturnType', (formData), { headers: headers })
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    //ExistTransaction
    public ExistTransaction(formData: any) {
        var objectData = { formData: formData};
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post(this.getSiteName() + '/api/SOMNT24/ExistTransaction', JSON.stringify(objectData), { headers: headers })
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    //GetDisplayErrorMessage
    public GetDisplayErrorMessage() {
        return this.http.get(this.getSiteName() + '/api/SOMNT24/GetDisplayErrorMessage')
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }
}
