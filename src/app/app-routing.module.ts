import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessFormsComponent } from './access-forms/access-forms.component';

const routes: Routes = [
  // { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'access',  component: AccessFormsComponent }
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
