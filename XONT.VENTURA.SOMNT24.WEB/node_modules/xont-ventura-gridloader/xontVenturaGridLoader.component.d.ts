import { EventEmitter } from "@angular/core";
export declare class XontVenturaGridLoaderComponent {
    RowStart: number;
    RowEnd: number;
    private CurrentPage;
    private TotalPage;
    private TaskCode;
    private MaxLen;
    private LastCurrentPage;
    onChange: EventEmitter<any>;
    init(taskCode: string): void;
    getPageSize(): number;
    getRowStart(): number;
    getRowEnd(): number;
    setRowCount(rowTotal: number): void;
    private getLoadSize();
    private emit();
    private btnFirst_OnClick();
    private btnPrev_OnClick();
    private btnNext_OnClick();
    private btnLast_OnClick();
    private currentPage_OnKeypress(event);
    private currentPage_OnBlur();
    setCurrentPage(num: number): void;
}
