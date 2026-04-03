import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { Http } from "@angular/http";
import { CommonService, DatetimeService } from "xont-ventura-services";
import { ProductBatchSerial } from './ProductBatchSerial';
export declare class BatchSelectorService {
    private http;
    private commonService;
    private datetimeService;
    constructor(http: Http, commonService: CommonService, datetimeService: DatetimeService);
    private componentMethodCallSource;
    componentMethodCalled$: Observable<any>;
    private taskCode;
    private decimalPlaces;
    private getAPIPrefix();
    AutoSelect1(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, checkExpiryDate: boolean): any;
    AutoSelect2(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], checkExpiryDate: boolean): any;
    AutoSelect3(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], autoSelect: boolean, checkExpiryDate: boolean): any;
    AutoSelect4(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], selectedBatchSerials: ProductBatchSerial[]): any;
    AutoSelect5(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], selectedBatchSerials: ProductBatchSerial[], addAllocated: boolean): any;
    GetBatchSerials1(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, checkExpiryDate: boolean): any;
    GetBatchSerials2(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], checkExpiryDate: boolean): any;
    GetBatchSerials3(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], autoSelect: boolean, checkExpiryDate: boolean): any;
    GetBatchSerials4(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], selectedBatchSerials: ProductBatchSerial[], checkExpiryDate: boolean): any;
    GetBatchSerials5(taskCode: string, territoryCode: string, warehouseCode: string, locationCode: string, productCode: string, requiredQty: number, uom: string, uom1: string, conversionFactor: number, reservedBatchSerials: ProductBatchSerial[], selectedBatchSerials: ProductBatchSerial[], addAllocated: boolean): any;
    private setupList(data);
    private AutoSelectBatches(currentBatchSerials, qty);
}
