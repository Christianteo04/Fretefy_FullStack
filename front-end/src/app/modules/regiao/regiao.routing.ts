import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegiaoListComponent } from './components/regiao-list/regiao-list.component';
import { RegiaoFormComponent } from './components/regiao-form/regiao-form.component';

const routes: Routes = [
  { path: '', component: RegiaoListComponent },
  { path: 'nova', component: RegiaoFormComponent }, 
  { path: 'editar/:id', component: RegiaoFormComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegiaoRoutingModule { }