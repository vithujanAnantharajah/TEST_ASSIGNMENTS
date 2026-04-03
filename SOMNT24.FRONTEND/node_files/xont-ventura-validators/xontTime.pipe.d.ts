import { PipeTransform } from "@angular/core";
import { DatetimeService } from 'xont-ventura-services';
export declare class XontTimePipe implements PipeTransform {
    private datetimeService;
    constructor(datetimeService: DatetimeService);
    transform(value: any): string;
}
