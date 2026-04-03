import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService, DatetimeService } from 'xont-ventura-services';
import { Subscription } from 'rxjs';
import { ReturnTypeService } from '../returntype.service';

@Component({
    selector: 'my-new',
    templateUrl: './app/new.component/new.component.html',
    providers: [ReturnTypeService]
})
export class NewComponent implements OnInit {

    private pageType: string = '';
    private RetnType: string = '';
    private ModuleCode: string = '';
    private recID = -1;

    public formData = {
        pageType: '',
        recID: -1,
        TimeStamp: '',
        ReturnType: '',
        Description: '',
        ModuleCode: '',
        ModuleCodeDesc: '',
        ReturnCategory: '',
        CategoryDesc: '',
        ReturnValueValidation: 'No',
        SalableReturn: true,
        DeductFromSales: true,
        Active: true

    }

    public formDataProperties = {
        ReturnType: { Enable: true },
        ModuleCode: { Enable: true },
        btnModuleCode: { Enable: true },
        ModuleCodeDesc: { Enable: true }
    }

    busy: Subscription;

    // prompt settings
    @ViewChild('msgPrompt') msgPrompt;
    @ViewChild('msgAlert') msgAlert;
   

    ////////List Promt//////////
    @ViewChild('lpmtModule') lpmtModule;
    @ViewChild('lpmtReturnCategory') lpmtReturnCategory;

    constructor(private route: ActivatedRoute, private http: Http, private router: Router, private commonService: CommonService, private returnTypeService: ReturnTypeService, private datetimeService: DatetimeService) {
        this.returnTypeService.componentMethodCalled$
            .subscribe(
            (error) => {
                this.msgPrompt.show(error, 'SOMNT24');
            }
            );
    }

    showError(err: any): void {
        this.msgPrompt.show(err.json(), 'SOMNT24');
    }

    ngOnInit(): void {
        this.route
            .params
            .subscribe(params => {
                this.pageType = params['pageType'];
                this.RetnType = params['retnType'];
                this.ModuleCode = params['moduleCode'];
                this.formData.pageType = this.pageType;
                this.loadView();
            });
        
    }

    ReturnTypeDataArray: any[] = [];

    private RVVcheck: string = '';

    loadView(): void {
        if (this.pageType == 'newBasedOn' || this.pageType =='edit') {
            //Get selected return Type
            this.busy = this.returnTypeService.SeletedReturnType(this.ModuleCode, this.RetnType)
                .subscribe(returnTypeJsonData => {
                    //Get Selected Data Item
                    this.ReturnTypeDataArray = returnTypeJsonData;
                    //Fill common Data
                    this.formData.Description = returnTypeJsonData.Description;
                    this.formData.ReturnCategory = returnTypeJsonData.ReturnCategory;
                    this.formData.CategoryDesc = returnTypeJsonData.ReturnCategoryDesc;
                    this.formData.ModuleCode = returnTypeJsonData.ModuleCode;
                    this.formData.ModuleCodeDesc = returnTypeJsonData.ModuleCodeDesc;
                    this.formData.TimeStamp = returnTypeJsonData.TimeStamp;

                    if (returnTypeJsonData.ProcessingRequired == "1") {
                        this.formData.SalableReturn = true;
                    } else {
                        this.formData.SalableReturn = false;
                    }

                    if (returnTypeJsonData.Status == "1") {
                        this.formData.Active = true;
                    } else {
                        this.formData.Active = false;
                    }

                    if (returnTypeJsonData.ReturnDeductionType == "0") {
                        this.formData.DeductFromSales = false;
                    } else {
                        this.formData.DeductFromSales = true;
                    }

                    if (returnTypeJsonData.ValidateReturnValue == "0") {
                        this.formData.ReturnValueValidation = 'No';
                        this.RVVcheck = '0'
                    }
                    else if (returnTypeJsonData.ValidateReturnValue == "1") {
                        this.formData.ReturnValueValidation = 'Mandatory';
                        this.RVVcheck = '1'
                    }
                    else {
                        this.formData.ReturnValueValidation = 'WithConfirmation';
                        this.RVVcheck = '2'
                    }

                    if (this.pageType == 'edit') {
                        //Edit
                        this.formData.ReturnType = returnTypeJsonData.RetnType;
                        this.formDataProperties.ReturnType.Enable = false;
                        this.formDataProperties.ModuleCode.Enable = false;
                        this.formDataProperties.btnModuleCode.Enable = false;
                        this.formDataProperties.ModuleCodeDesc.Enable = false;
                    }
                    if (this.pageType == 'newBasedOn') {
                        //new Based on
                        this.formData.ReturnType = '';
                    }

                },
                (errer) => {
                    this.showError(errer)
                }
                );
        } else {
            this.formData.ReturnValueValidation = 'No';
        }
    }


    //Select Module Prompt
    lpmtModule_DataBind() {
        this.lpmtModule.dataSourceObservable = this.returnTypeService.GetModulePromptDataForNew();
    }

    //Select Return Category Prompt
    lpmtReturnCategory_DataBind() {
        this.lpmtReturnCategory.dataSourceObservable = this.returnTypeService.GetCategoryPromptData();
    }

    //Select Return Value Validation
    ChangeReturnValueValidation(entry): void {
        this.formData.ReturnValueValidation = entry;
        this.clickRadtionButton();
    }

    clickRadtionButton() {
        console.log('Radio Button Event');
        if (this.pageType == 'edit'){
            this.busy = this.returnTypeService.ExistTransaction(this.formData)
                .subscribe(response => {
                    if (response != '') {
                        if (this.RVVcheck == "0") {
                            this.formData.ReturnValueValidation = 'No';
                            this.busy = this.returnTypeService.GetDisplayErrorMessage()
                                .subscribe(response => {
                                },
                                (err) => {
                                    this.showError(err)
                                });

                        }
                        else if (this.RVVcheck == "1") {
                            if (response == "0") {
                                this.formData.ReturnValueValidation = 'Mandatory';
                                this.busy = this.returnTypeService.GetDisplayErrorMessage()
                                    .subscribe(response => {
                                    },
                                    (err) => {
                                        this.showError(err)
                                    });
                            }
                        }
                        else if (this.RVVcheck == "2") {
                            if (response == "0") {
                                this.formData.ReturnValueValidation = 'WithConfirmation';
                                this.busy = this.returnTypeService.GetDisplayErrorMessage()
                                    .subscribe(response => {
                                    },
                                    (err) => {
                                        this.showError(err)
                                    });
                            }
                        }
                    }
                    
                },
                (err) => {
                    this.showError(err)
                }
                );
        }
        
    }

    btnOk_OnClick(formData): void {
        this.busy = this.returnTypeService.InsertReturnType(formData)
            .subscribe(jsonData => {
                console.log('submited Success', jsonData);
                if (jsonData == true) {
                    this.router.navigateByUrl('/list');
                } else {
                    this.msgPrompt.showAlert("Data Submited Failed");
                }
            },
            (err) => {
                this.showError(err)
            });
    }

    goBack(): void {
        this.router.navigateByUrl('/list');
    }

    btnClose_OnClick(): void {
        this.goBack();
    }

}