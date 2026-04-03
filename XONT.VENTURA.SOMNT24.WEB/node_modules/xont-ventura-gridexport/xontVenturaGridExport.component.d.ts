export declare class XontVenturaGridExportComponent {
    id: string;
    gridName: string;
    gridId: string;
    constructor();
    btnExcelExport_OnClick(tableID: any, tableName: any): void;
    emitXmlHeader(tableName: string): String;
    emitXmlFooter(): String;
    isIE(): boolean;
    htmlTableToXML(tableID: string, tableName: string): string;
    cellText: any;
    getDeepText(DOMObject: any): any;
    btnPDFExport_OnClick(tableID: string, tableName: string): void;
    private columnList;
    private getJSONColumnRows(tableID);
    btnWordExport_OnClick(tableID: string, tableName: string): void;
    getHTMLTable(tableID: string): string;
}
