import { EventEmitter } from '@angular/core';
export declare class VenturaButtonComponent {
    id: string;
    type: string;
    btnCaption: string;
    confMsg: string;
    confContinueMsg: string;
    confOkBtnCaption: string;
    confCancelBtnCaption: string;
    modifyCheck: boolean;
    modified: boolean;
    onClick: EventEmitter<{}>;
    popUpVisible: boolean;
    ngOnInit(): void;
    btnTemplateButton_Click(): void;
    OK_Click(): void;
    Cancel_Click(): void;
}
