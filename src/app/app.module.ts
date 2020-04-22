import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';

import {NgxPaginationModule} from 'ngx-pagination';
import {CookieService} from 'ngx-cookie-service';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {MatPaginatorIntl} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MultilanguagePanigator} from './base/table/multilanguage.paginator';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {FlexLayoutModule} from '@angular/flex-layout';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {ApiService} from './_services/api.service';
import {AuthenticationService} from './_services/authentication.service';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import {NavService} from './_services/nav.service';
import {MenuListItemComponent} from './_helpers/menu-list-item/menu-list-item.component';
import {TopNavComponent} from './_helpers/top-nav/top-nav.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LogoutComponent} from './logout/logout.component';
import {MaterialModule} from './material.module';
import {AppRoutingModule} from './app-routing.module';
import {ToastrModule} from 'ngx-toastr';
import {JsogService} from 'jsog-typescript';
import {FileSaverModule} from 'ngx-filesaver';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {GlobalErrorHandler} from './_services/errorHandle/global-error-handler';
import {TableComponent} from './base/table/table.component';
import {AutocompleteComponent} from './base/autocomplete/autocomplete.component';
import {SelectComponent} from './base/select/select.component';
import {InputComponent} from './base/Input/input.component';
import {CounterInputComponent} from './base/counter-input/counter.input.component';
import {CheckboxComponent} from './base/checkbox/checkbox.component';
import {DatepickerComponent} from './base/datepicker/datepicker.component';
import {Utils} from './base/utils/utils';
import {UiStateService} from './_services/ui.state/ui.state.service';
import {UserComponent} from './components/user/l-d-user/user.component';
import {OrganizationComponent} from "./components/organization/list-organization/organization.component";
import {AddEditOrganizationComponent} from "./components/organization/a-e-organization/a-e-organization.component";
import {RequisitionComponent} from "./components/requisition/requisition.component";
import {AddEditRequisitionComponent} from "./components/requisition/a-e-requisition/a-e-requisition.component";
import {AddEditUserComponent} from "./components/user/a-e-user/add.edit.user.component";
import {FileComponent} from "./base/file/file.component";
import {SignDocumentComponent} from "./components/sign_document/sign_document.component";
import {ConfirmRequisitionComponent} from "./components/sign_document/confirm-requesition/confirm-requisition.component";
import {UserDetailComponent} from "./components/user/user-detail/user-detail.component";
import {RequisitionDetailComponent} from "./components/requisition/requisition-detail/requisition-detail.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    ScrollDispatchModule,
    CdkStepperModule,
    CdkTableModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    MenuListItemComponent,
    TopNavComponent,
    DashboardComponent,
    TableComponent,
    AutocompleteComponent,
    SelectComponent,
    InputComponent,
    CheckboxComponent,
    CounterInputComponent,
    DatepickerComponent,
    FileComponent,
    UserComponent,
    AddEditUserComponent,
    OrganizationComponent,
    AddEditOrganizationComponent,
    RequisitionComponent,
    AddEditRequisitionComponent,
    SignDocumentComponent,
    ConfirmRequisitionComponent,
    UserDetailComponent,
    RequisitionDetailComponent
  ],
  // Mấy ông mà gọi Modal là phải cho vào đây nhé @@
  entryComponents: [
    LoginComponent,
    ConfirmRequisitionComponent,
    RequisitionDetailComponent,
    UserDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    FileSaverModule,
    ToastrModule.forRoot(), // ToastrModule added
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    NgxChartsModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MatPaginatorIntl, useClass: MultilanguagePanigator},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    CookieService,
    LoginComponent,
    AuthenticationService,
    ApiService,
    NavService,
    JsogService,
    Utils,
    UiStateService
  ],
  bootstrap: [AppComponent]

})

export class AppModule {
}
