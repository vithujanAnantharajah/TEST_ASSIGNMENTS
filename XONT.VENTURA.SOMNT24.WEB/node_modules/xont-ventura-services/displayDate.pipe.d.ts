import { PipeTransform } from "@angular/core";
import { DatetimeService } from './datetime.service';
export declare class DisplayDatePipe implements PipeTransform {
    private datetimeService;
    constructor(datetimeService: DatetimeService);
    transform(value: any): string;
}
