import { Component, OnInit, ViewChild, AfterViewInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService, DatetimeService } from 'xont-ventura-services';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { XontVenturaCollapsibleModule } from 'xont-ventura-collapsible';
import { XontVenturaGridLoaderModule } from 'xont-ventura-gridloader';
import { XontVenturaListPromptModule } from 'xont-ventura-list-prompt';
import { XontVenturaMessagePromptModule } from 'xont-ventura-message-prompt';
import { ReturnTypeService } from 'src/app/services/return-type.service';

@Component({
  selector: 'app-list',
  templateUrl: './list-page.component.html',
  styleUrls: ['./list-page.component.scss']
})
export class ListPageComponent implements AfterViewInit {

  // ViewChild references with proper typing
  @ViewChild('gridLoader') gridLoader: any;
  @ViewChild('msgPrompt') msgPrompt: any;
  @ViewChild('lpmtModule') lpmtModule: any;

  // State Management using modern patterns
  public returnType = signal<any[]>([]);
  public busy: any; // Used for ngBusy directive

  public selectionCriteria: any = this.getDefaultSelectionCriteria();

  // Datatable configuration
  public rowsOnPage = 10;
  public sortBy = "ReturnType";
  public sortOrder = "asc";

  constructor(
    private router: Router,
    private commonService: CommonService,
    private returnTypeService: ReturnTypeService,
    private datetimeService: DatetimeService) {
    this.returnTypeService.errorOccurred$.subscribe((error: HttpErrorResponse) => {
      this.msgPrompt?.show(error, 'SOMNT24');
    });
  }
  
  ngAfterViewInit(): void {
    this.initConfiguration();
  }

  /**
   * Initializes component state from LocalStorage
   */
  private initConfiguration(): void {
    const storedCriteria = localStorage.getItem('SOMNT24_SelectionCriteria');

    if (storedCriteria) {
      try {
        this.selectionCriteria = JSON.parse(storedCriteria);
      } catch (e) {
        console.warn('Invalid storage data, resetting criteria.');
        localStorage.removeItem('SOMNT24_SelectionCriteria');
      }
    }

    // Initial data load
    this.list(true);
  }

  private getDefaultSelectionCriteria(): any {
    return {
      ModuleCode: '',
      ModuleCodeDesc: '',
      RetnType: '',
      Description: '',
      Status: true,
      FirstRow: 0,
      LastRow: 0,
      Collapsed: true
    };
  }

  /**
   * Data binding for the Module List Prompt
   */
  public lpmtModule_DataBind(): void {
    this.lpmtModule.dataSourceObservable = this.returnTypeService.getModulePromptData();
  }

  /**
   * Core logic to fetch data based on criteria
   * @param isInit Reset pagination to page 1
   */
  public list(isInit: boolean): void {
    if (!this.gridLoader) return;

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

    // Persist search state
    localStorage.setItem('SOMNT24_SelectionCriteria', JSON.stringify(this.selectionCriteria));

    // Execute API call
    this.busy = this.returnTypeService.listReturnTypeData(this.selectionCriteria)
      .pipe(finalize(() => { /* Any cleanup after load */ }))
      .subscribe({
        next: (response: [any[], number]) => {
          this.returnType.set(response[0]); // Update Signal
          this.gridLoader.setRowCount(response[1]);
        },
        error: (err) => this.msgPrompt.show(err, 'SOMNT24')
      });
  }

  // --- Navigation Handlers ---

  public btnNewBased_onClick(item: any): void {
    this.router.navigate(['new/newBasedOn', item.ReturnType, item.ModuleCode]);
  }

  public btnEdit_onClick(item: any): void {
    this.router.navigate(['new/edit', item.ReturnType, item.ModuleCode]);
  }

  public newClick(): void {
    this.router.navigate(['new/new']);
  }

  public gridLoader_OnChange(): void {
    this.list(false);
  }

  public trackByReturnType(index: number, item: any): string {
    return item?.ReturnType ?? index.toString();
  }

  public closeTab(): void {
    window.close();
  }
}