import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CidadeSelectorComponent } from './components/cidade-selector/cidade-selector.component';

@NgModule({
  declarations: [
    CidadeSelectorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CidadeSelectorComponent
  ]
})
export class SharedModule { }