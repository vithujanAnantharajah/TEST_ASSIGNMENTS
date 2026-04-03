import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Http } from "@angular/http";
import { CommonService } from "xont-ventura-services";
export declare class XontVenturaSinglePromptService {
    private http;
    private commonService;
    constructor(http: Http, commonService: CommonService);
    private taskCode;
    private getAPIPrefix();
    GetPredefinedPrompt(taskCode: string, ListFromID: string, ExternalParameters: string): any;
    GetDataForMasterClassificationPopup(data: any, taskCode: string): any;
}
