import { ElementRef, EventEmitter } from "@angular/core";
import { XontQuantityPipe } from './xontQuantity.pipe';
import { ValidatorService } from './validator.service';
import { ControlValueAccessor } from '@angular/forms';
export declare const CUSTOM_INPUT_CONTROL_QUANTITY_ACCESSOR: any;
export declare class XontQuantityDirective implements ControlValueAccessor {
    private elementRef;
    private quantityPipe;
    private validatorService;
    private el;
    ngModelChange: EventEmitter<{}>;
    constructor(elementRef: ElementRef, quantityPipe: XontQuantityPipe, validatorService: ValidatorService);
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    onBlur(value: any): void;
    onFocus(value: any): void;
    onKeyup(value: any): void;
    onKeypress(evt: any): boolean;
    onDrop(): void;
    setDisabledState(isDisabled: boolean): void;
}
