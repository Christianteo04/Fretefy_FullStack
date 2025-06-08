import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Cidade } from 'src/app/core/models/cidade.model';

@Component({
  selector: 'app-cidade-selector',
  templateUrl: './cidade-selector.component.html',
  styleUrls: ['./cidade-selector.component.scss']
})
export class CidadeSelectorComponent {

  @Input() formControl: FormControl = new FormControl();

  @Input() listaCidades: Cidade[] | null = [];

  @Input() label: string = 'Cidade';
  @Input() placeholder: string = 'Selecione uma opção';
}