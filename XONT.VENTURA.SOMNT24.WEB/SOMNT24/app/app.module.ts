import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BusyModule } from 'angular2-busy';
import { XontVenturaMessagePromptModule } from 'xont-ventura-message-prompt';
import { XontVenturaSinglePromptModule } from 'xont-ventura-single-prompt';
import { XontVenturaMultiplePromptModule } from 'xont-ventura-multiple-prompt';
import { XontVenturaDatepickerModule } from 'xont-ventura-datepicker';
import { XontVenturaListPromptModule } from 'xont-ventura-list-prompt';

import { XontVenturaGridExportModule } from 'xont-ventura-gridexport';
import { XontVenturaValidatorsModule } from 'xont-ventura-validators';

import { XontVenturaClassificationSelectorModule } from 'xont-ventura-classification-selector';
import { XontVenturaCollapsibleModule } from 'xont-ventura-collapsible';
import { XontVenturaGridLoaderModule } from 'xont-ventura-gridloader';

import { CommonService, DatetimeService, DisplayDatePipe } from 'xont-ventura-services';

import { ListComponent } from './list.component/list.component';
import { NewComponent } from './new.component/new.component';


const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'list', component: ListComponent },
    { path: 'new/:pageType', component: NewComponent },
    { path: 'new/:pageType/:retnType/:moduleCode', component: NewComponent }
];

@NgModule({
    imports: [BrowserModule, DataTableModule, HttpModule, FormsModule, RouterModule.forRoot(routes),
        BrowserAnimationsModule, BusyModule, XontVenturaMessagePromptModule, XontVenturaSinglePromptModule,
        XontVenturaMultiplePromptModule, XontVenturaDatepickerModule, XontVenturaValidatorsModule,
        XontVenturaGridExportModule, XontVenturaClassificationSelectorModule, XontVenturaCollapsibleModule,
        XontVenturaGridLoaderModule, XontVenturaListPromptModule
    ],
    declarations: [AppComponent, ListComponent, NewComponent], //DisplayDatePipe
    bootstrap: [AppComponent],
    providers: [CommonService, DatetimeService],
})
export class AppModule { }