import { PipeTransform } from "@angular/core";
import { ValidatorService } from './validator.service';
export declare class XontQuantityPipe implements PipeTransform {
    private validatorService;
    constructor(validatorService: ValidatorService);
    transform(value: any): string;
}
