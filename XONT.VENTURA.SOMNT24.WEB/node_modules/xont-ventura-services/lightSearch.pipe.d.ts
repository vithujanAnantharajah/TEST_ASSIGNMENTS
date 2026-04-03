import { PipeTransform } from '@angular/core';
import { DatetimeService } from 'xont-ventura-services';
export declare class LightSearchPipe implements PipeTransform {
    private datetimeService;
    constructor(datetimeService: DatetimeService);
    transform(table: any[], keyword: string, fields: any[]): any[];
}
