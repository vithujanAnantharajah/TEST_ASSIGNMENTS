import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { CommonService } from 'xont-ventura-services';
export declare class XontVenturaTaskNotificationService {
    private http;
    private commonService;
    private GetApiPrefix();
    constructor(http: Http, commonService: CommonService);
    CreateUserNotification(taskCode: string): Observable<any>;
}
