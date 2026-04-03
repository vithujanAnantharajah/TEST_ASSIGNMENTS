import { ElementRef, EventEmitter } from "@angular/core";
import { ControlValueAccessor } from '@angular/forms';
import { XontValuePipe } from './xontValue.pipe';
import { ValidatorService } from './validator.service';
export declare const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any;
export declare class XontValueDirective implements ControlValueAccessor {
    private elementRef;
    private valuePipe;
    private validatorService;
    private el;
    ngModelChange: EventEmitter<{}>;
    constructor(elementRef: ElementRef, valuePipe: XontValuePipe, validatorService: ValidatorService);
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
