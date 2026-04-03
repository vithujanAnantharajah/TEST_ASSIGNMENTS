import { Component, computed, inject, signal } from '@angular/core';
import { ReturnTypeService } from 'src/app/services/return-type.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

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
    this.fetchSelectedType(item.moduleCode, item.returnType);

    this.selectedItem.set({
      ...item, isSalable: item.isSalable ?? '0',
      isDeductFromSales: item.isDeductFromSales ?? '0',
      status: item.status ?? '1'
    });
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
      this.selectedItem()!.moduleCode = m.code;
      this.isEditModuleOpen.set(false);
      this.fetchSelectedType(m.code, this.selectedItem()!.returnType);
    }
  }

  updateEditCategory(m: any) {
    if (this.selectedItem()) {
      this.selectedItem()!.returnCategory = m['returnCategory'];
      this.selectedItem()!.categoryDesc = m['description']; // If you need the desc elsewhere
      this.isEdditTypeOpen.set(false);
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
    this.isLoading.set(true);

    // 1. Construct the parameters correctly
    const params = new HttpParams()
      .set('moduleCode', modCode)
      .set('returnType', retType);

    // 2. Pass the params object in the options
    this.service.get<any>('SOMNT24/SeletedReturnType', { params }).subscribe({
      next: (res) => {
        // res will be the ReturnType object if found, or null
        this.types.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch failed:', err);
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

    // 1. Prepare the payload (Mapping UI booleans to DB strings '1'/'0')
    const payload = {
      ...item,
      // Legacy logic: Mapping checkbox booleans/strings to '1' or '0'
      ProcessingRequired: item.isSalable === '1' ? '1' : '0',
      Status: item.status === '1' ? '1' : '0',
      ReturnDeductionType: item.isDeductFromSales === '1' ? '1' : '0',
      // Radio button value logic
      ValidateReturnValue: item.processingRequired === 'No' ? '0' :
        item.processingRequired === 'Mandatory' ? '1' : '2'
    };

    this.isSaving.set(true);

    this.insertOrUpdateRecord(payload);
  }

  private insertOrUpdateRecord(payload: any) {
    // Matches btnOk_OnClick in your legacy code
    this.service.post<boolean>('SOMNT24/InsertReturnType', payload).subscribe({
      next: (success) => {
        if (success) {
          this.handleSuccess('Record created successfully');
        } else {
          console.error('Data Submission Failed');
          this.isSaving.set(false);
        }
      },
      error: (err) => this.handleError(err)
    });
  }


  private handleSuccess(message: string) {
    this.isSaving.set(false);
    this.closeModal();
    this.loadData(); // Refresh the grid
    // Add a toast/notification here if you have one
  }

  private handleError(err: any) {
    console.error('API Error:', err);
    this.isSaving.set(false);
    // Map to your legacy msgPrompt error display if needed
  }

}
