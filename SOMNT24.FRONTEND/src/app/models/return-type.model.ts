// models/return-type.model.ts
export interface ReturnTypeData {
    moduleCode: string;
    returnType: string;
    description?: string;
    // ... add other fields based on your .NET SOMNT24 class
}

export interface SelectionCriteria {
    businessUnit?: string;
    moduleCode?: string;
    retnType?: string;
    firstRow: number;
    lastRow: number;
    ModuleCode: any;
}