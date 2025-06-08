import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CidadeSelectorComponent } from './components/cidade-selector/cidade-selector.component';

@NgModule({
  declarations: [
    CidadeSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CidadeSelectorComponent
  ]
})
export class SharedModule { }