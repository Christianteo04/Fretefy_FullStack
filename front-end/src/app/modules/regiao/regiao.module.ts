import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms'; 

import { MatDialogModule } from '@angular/material/dialog'

import { RegiaoRoutingModule } from './regiao.routing'; 
import { RegiaoListComponent } from './components/regiao-list/regiao-list.component';
import { RegiaoFormComponent } from './components/regiao-form/regiao-form.component';


@NgModule({
  declarations: [
    RegiaoListComponent,
    RegiaoFormComponent
  ],
  imports: [
    CommonModule,
    RegiaoRoutingModule,
    ReactiveFormsModule, 
    SharedModule,
    MatDialogModule      

  ]})
export class RegiaoModule { }