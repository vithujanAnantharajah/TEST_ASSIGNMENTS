import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Router } from '@angular/router';
import { CommonService, DatetimeService } from 'xont-ventura-services';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { ReturnTypeService } from '../returntype.service';


@Component({
    selector: 'my-list',
    templateUrl: './app/list.component/list.component.html',
    providers: [ReturnTypeService]
})
export class ListComponent  {
    
    public returnType: any[] = [];

    public selectionCriteria = {
        ModuleCode : '',
        ModuleCodeDesc : '',
        RetnType : '',
        Description : '',
        Status: true,
        FirstRow: 0,
        LastRow: 0,
        Collapsed: true
    };

    public loadingButton = {
        CurrentPage:0,TotalPage:0
    };

    ////////////////Datatable////////////////////
    public rowsOnPage = 10;
    public sortBy = "ReturnType";
    public sortOrder = "asc";

    busy: Subscription;
    /////////ViewChild/////////////
    @ViewChild('gridLoader') gridLoader;
    @ViewChild('msgPrompt') msgPrompt;

    ////////List Promt//////////
    @ViewChild('lpmtModule') lpmtModule;

    constructor(private http: Http, private location: Location, private commanService: CommonService, private returnTypeService: ReturnTypeService, private router: Router, private datetimeService: DatetimeService) {
        this.returnTypeService.componentMethodCalled$
            .subscribe(
            (error) => {
                this.msgPrompt.show(error, 'SOMNT24');
            }
            );
    }

    //v3002	remove
    //ngOnInit(): void {

    //    if (localStorage.getItem('SOMNT24_SelectionCriteria') != null) {
    //        this.selectionCriteria = JSON.parse(localStorage.getItem('SOMNT24_SelectionCriteria'));
    //    }
    //    this.loadView();
    //}

    //v3002 add
    ngAfterViewInit(): void {
        const storedCriteria = localStorage.getItem('SOMNT24_SelectionCriteria');
        console.log('Stored Criteria:', storedCriteria);

        if (storedCriteria) {
            try {
                const parsedCriteria = JSON.parse(storedCriteria);
                console.log('Parsed Criteria:', parsedCriteria);

                if (!parsedCriteria) {
                    throw new Error('Parsed selection criteria is null');
                }
                this.selectionCriteria = parsedCriteria;
            } catch (e) {
                console.warn('Failed to parse stored selection criteria.');
                localStorage.removeItem('SOMNT24_SelectionCriteria');
                this.setDefaultSelectionCriteria();
            }
        } else {
            this.setDefaultSelectionCriteria();
        }

        // Load the initial view AFTER ViewChild references are ready
        this.loadView();
    }//v3002 add

    //v3002	add
    setDefaultSelectionCriteria(): void {
        this.selectionCriteria = {
            ModuleCode: '',
            ModuleCodeDesc: '',
            RetnType: '',
            Description: '',
            Status: true,
            FirstRow: 0,
            LastRow: 0,
            Collapsed: true
        };
    } //v3002 ADD


    loadView(): void {
        this.list(true);
    }
    
    showError(err:any): void {
        this.msgPrompt.show(err.json(),'SOMNT24');
    }

    //Select Module Prompt
    lpmtModule_DataBind() {
        this.lpmtModule.dataSourceObservable = this.returnTypeService.GetModulePromptData();
    }

    list(isInit: boolean): void{


            this.gridLoader.init('SOMNT24');
            this.rowsOnPage = this.gridLoader.getPageSize();

            if (isInit) {
                this.gridLoader.setCurrentPage(1);
                this.selectionCriteria.FirstRow = 1;
                this.selectionCriteria.LastRow = this.gridLoader.getLoadSize();
            } else {
                this.selectionCriteria.FirstRow = this.gridLoader.getRowStart();
                this.selectionCriteria.LastRow = this.gridLoader.getRowEnd();
            }

            localStorage.setItem('SOMNT24_SelectionCriteria', JSON.stringify(this.selectionCriteria));
            this.busy = this.returnTypeService.ListReturnTypeData(this.selectionCriteria)
                .subscribe(
                (jsonData) => {
                    //console.log('hey are you working Order .?', jsonData);
                    this.returnType = jsonData[0];
                    this.gridLoader.setRowCount(jsonData[1]);
                },
                (err) => {
                    this.showError(err);
                }
                );
        
    }
    btnNewBased_onClick(item): void {
        this.router.navigateByUrl('new/newBasedOn/' + item.ReturnType + '/' + item.ModuleCode);
    }

    btnEdit_onClick(item): void {
        this.router.navigateByUrl('new/edit/' + item.ReturnType + '/' + item.ModuleCode);
    }

    newClick(): void {
        this.router.navigateByUrl('new/new');
    }
    
    gridLoader_OnChange(data) {
        this.list(false);
    }
    
}