import { ElementRef, EventEmitter } from "@angular/core";
import { ValidatorService } from './validator.service';
export declare class XontDescriptionDirective {
    private elementRef;
    private validatorService;
    private el;
    ngModelChange: EventEmitter<{}>;
    private descRegx;
    constructor(elementRef: ElementRef, validatorService: ValidatorService);
    onKeypress(evt: any): boolean;
    onBlur(value: any): void;
    onPaste(): void;
    onDrop(): void;
}
