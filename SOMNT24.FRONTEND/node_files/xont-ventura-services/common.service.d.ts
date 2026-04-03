import { Location } from '@angular/common';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
export declare class CommonService {
    private http;
    private location;
    constructor(http: Http, location: Location);
    getAPIPrefix(): any;
    getAPIPrefix(taskCode: string): any;
    convertAmountToNumber(amount: string): number;
    convertNumberToAmount(num: any, noOfMinimumDecimalPlaces: number): string;
    private getDecimalOffset(noOfRemainingDecimalPoints);
    isInternetExplorer(): boolean;
    generateExcel(htmlCode: string, filename: string): void;
    getRootURL(): string;
    getPageSize(taskCode: string): number;
    fieldLevelAuthentication(componentName: string, taskCode: string): Observable<any>;
    private restrictSpecificControls(list);
    showLoadingIcon(): void;
}
