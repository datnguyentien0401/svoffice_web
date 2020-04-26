import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LogoutComponent} from './logout/logout.component';
import {UserComponent} from './components/user/l-d-user/user.component';
import {OrganizationComponent} from "./components/organization/list-organization/organization.component";
import {RequisitionComponent} from "./components/requisition/requisition.component";
import {AddEditOrganizationComponent} from "./components/organization/a-e-organization/a-e-organization.component";
import {AddEditRequisitionComponent} from "./components/requisition/a-e-requisition/a-e-requisition.component";
import {AddEditUserComponent} from "./components/user/a-e-user/add.edit.user.component";
import {SignDocumentComponent} from "./components/sign_document/sign_document.component";
import {UserDetailComponent} from "./components/user/user-detail/user-detail.component";
import {RequisitionDetailComponent} from "./components/requisition/requisition-detail/requisition-detail.component";
import {ReceiveRequisitionComponent} from "./components/receive-requisition/receive-requisition.component";


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'home', component: DashboardComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'employee', component: UserComponent},
  {path: 'employee/add', component: AddEditUserComponent},
  {path: 'employee/edit/:id', component: AddEditUserComponent},
  {path: 'employee/:id', component: UserDetailComponent},

  {path: 'organization', component: OrganizationComponent},
  {path: 'organization/add', component: AddEditOrganizationComponent},
  {path: 'organization/edit/:id', component: AddEditOrganizationComponent},

  {path: 'requisition', component: RequisitionComponent},
  {path: 'requisition/add', component: AddEditRequisitionComponent},
  {path: 'requisition/edit/:id', component: AddEditRequisitionComponent},
  {path: 'requisition/:id', component: RequisitionDetailComponent},


  {path: 'sign-document', component: SignDocumentComponent},
  {path: 'receive-document', component: ReceiveRequisitionComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      useHash: true,
    }
  )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
