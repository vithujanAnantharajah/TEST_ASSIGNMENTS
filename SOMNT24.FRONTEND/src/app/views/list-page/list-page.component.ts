import { Component, computed, inject, signal } from '@angular/core';
import { ReturnTypeService } from 'src/app/services/return-type.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpHeaders, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-list-page',
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.scss'
})
export class ListPageComponent {

  Math = Math;

  private service = inject(ReturnTypeService);
  returnTypes = signal<any[]>([]);
  isLoading = signal<boolean>(false);
  private router = inject(Router);
  searchText = signal<string>('');
  isActiveOnly = signal<boolean>(true);
  retnTypeSearch = signal<string>('');
  descSearch = signal<string>('');
  moduleSearch = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  totalRecords = signal<number>(0);

  totalPages = computed(() => Math.ceil(this.totalRecords() / this.pageSize()));

  selectionCriteria = {
    businessUnit: "LUCK", // Adjust based on your login data
    moduleCode: "",
    moduleCodeDesc: "",
    retnType: "",
    description: "",
    startWith: true,
    status: true,
    firstRow: 1,
    lastRow: 10
  };
  selectedItem = signal<any | null>(null);
  isSaving = signal<boolean>(false);
  isEditModuleOpen = signal(false);
  modules = signal<any[]>([]);
  moduleSearchTerm = signal<any>('');
  isEdditTypeOpen = signal(false);
  types = signal<any[]>([]);
  typeSearchTerm = signal<any>('');

  constructor(private toastr: ToastrService){}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData(page: number = 1) {
    this.isLoading.set(true);
    this.currentPage.set(page);

    const firstRow = (page - 1) * this.pageSize() + 1;
    const lastRow = page * this.pageSize();

    const payload = {
      businessUnit: "LUCK",
      retnType: this.retnTypeSearch(),
      description: this.descSearch(),
      moduleCode: this.moduleSearch(),
      status: this.isActiveOnly() == true ? 1 : 0,
      firstRow: firstRow,
      lastRow: lastRow
    };
    // Save state before fetching
    this.service.post<any>('SOMNT24/ListReturnTypeData', payload).subscribe({
      next: (res) => {
        // res.data corresponds to the data field in your .NET Core API response
        this.returnTypes.set(res.data || []);
        this.totalRecords.set(res.total);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  get pageArray() {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  onEdit(item: any) {
    this.isEditModuleOpen.set(false);
    this.isEdditTypeOpen.set(false);
    this.loadModules();

    this.selectedItem.set({
      ...item,
      isSalable: item.isSalable ?? '0',
      isDeductFromSales: item.isDeductFromSales ?? '0',
      status: item.status ?? '1',
      moduleCode: item.moduleCode,
      returnType: item.returnType,
      isNew: false
    });
    this.fetchSelectedType(item.moduleCode, item.returnType);
  }

  closeModal() {
    this.selectedItem.set(null);
  }

  onNewBasedOn(item: any) {
    this.router.navigate(['new/newBasedOn', item.ReturnType, item.ModuleCode]);
  }

  onNew() {
    // 1. Reset dropdown states
    this.isEditModuleOpen.set(false);
    this.isEdditTypeOpen.set(false);

    // 2. Fetch dependencies (if not already loaded)
    this.loadModules();

    // 3. Initialize a fresh object for a NEW record
    this.selectedItem.set({
      moduleCode: '',       // User will select from dropdown
      returnType: '',       // User will type this
      description: '',
      returnCategory: '',   // New field we added
      processingRequired: '0', // Default to "No"
      isSalable: '1',       // Default to active/true for new items
      isDeductFromSales: '1',
      status: '1',
      isNew: true           // Flag to tell onUpdate whether to POST or PUT
    });
  }

  resetFilters() {
    // Reset all search signals
    this.retnTypeSearch.set('');
    this.descSearch.set('');
    this.moduleSearch.set('');
    this.isActiveOnly.set(true);

    // Reload the grid with empty filters
    this.loadData();
  }

  updateEditModule(m: any) {
    if (this.selectedItem()) {
      this.selectedItem()!.moduleCode = m['module Code'].trim();
      this.isEditModuleOpen.set(false);
      this.fetchSelectedType(m['module Code'].trim(), this.selectedItem()!.returnType);
    }
  }

  updateEditCategory(m: any) {
    if (this.selectedItem()) {
      this.selectedItem()!.returnCategory = m['return Catagory'].trim();
      this.isEdditTypeOpen.set(false);
    }
  }

  loadModules() {
    this.isLoading.set(true);

    this.service.get<any>('SOMNT24/GetModulePromptData').subscribe({
      next: (res) => {
        this.modules.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch failed:', err);
        this.isLoading.set(false);
      }
    });
  }

  fetchSelectedType(modCode: string, retType: string) {
    if (!modCode || !retType) return;
    this.isLoading.set(true);

    this.service.get<any>('SOMNT24/SeletedReturnType?moduleCode=' + modCode.trim() + '&returnType=' + retType.trim(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: (res) => {
        if (res) {
          this.selectedItem.set({
            ...this.selectedItem(),
            ...res,
            isSalable: res.processingRequired === '1' ? '1' : '0',
            isDeductFromSales: res.returnDeductionType === '1' ? '1' : '0',
            status: res.status === '1' ? '1' : '0',
            processingRequired: res.validateReturnValue === '0' ? 'No' :
              res.validateReturnValue === '1' ? 'Mandatory' : 'WithConfirmation',
            timeStamp: res.timeStamp
          });
        }
        this.isLoading.set(false);
      }
    });
  }

  filteredModules = computed(() => {
    const term = this.moduleSearchTerm().toLowerCase();

    return this.modules().filter(m => {
      // Safely check both fields from your API response
      const code = (m['module Code'] || '').toLowerCase();
      const desc = (m.description || '').toLowerCase();

      return code.includes(term) || desc.includes(term);
    });
  });

  onUpdate() {
    const item = this.selectedItem();
    if (!item) return;

    const payload = {
      ModuleCode: item.moduleCode,
      ReturnType: item.returnType,
      Description: item.description,
      ReturnCategory: item.returnCategory,
      SalableReturn: item.isSalable === '1',
      Active: item.status === '1',
      DeductFromSales: item.isDeductFromSales === '1',
      ReturnValueValidation: item.processingRequired,
      TimeStamp: item.timeStamp,
      pageType: item.isNew ? 'new' : 'edit'
    };

    this.isSaving.set(true);
    this.insertOrUpdateRecord(payload);
  }

  private insertOrUpdateRecord(payload: any) {
    this.isSaving.set(true);

    this.service.post<any>('SOMNT24/InsertReturnType', payload).subscribe({
      next: (res) => {
        if (res && res.success) {
          const action = payload.pageType === 'new' ? 'Created' : 'Updated';
          this.handleSuccess(`Return Type ${action} successfully.`);
        } else {
          this.handleError('Database update failed. Please check your inputs.');
        }
      },
      error: (err) => {
        if (err.status === 409) {
          this.handleError('This Return Type already exists for the selected Module.');
        } else if (err.status === 401) {
          this.handleError('Session expired. Please log in again.');
        } else {
          this.handleError('Server error occurred while saving.');
        }
        console.error('Save Error:', err);
      },
      complete: () => {
        this.isSaving.set(false);
      }
    });
  }


  private handleSuccess(message: string) {
    this.isSaving.set(false);
    this.closeModal();
    this.loadData(); 
    alert(message);
  }

  private handleError(err: any) {
    this.isSaving.set(false);

    if (err.error && err.error.desc) {
      alert(err.error.desc); 
      return;
    }

    // Fallback for generic errors
    const errorMessage = typeof err === 'string' ? err : 'A server error occurred.';
    alert(errorMessage);
  }

}
