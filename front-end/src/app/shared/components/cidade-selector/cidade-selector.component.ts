import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Cidade } from 'src/app/core/models/cidade.model';

@Component({
  selector: 'app-cidade-selector',
  templateUrl: './cidade-selector.component.html',
  styleUrls: ['./cidade-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CidadeSelectorComponent),
      multi: true
    }
  ]
})
export class CidadeSelectorComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = 'Cidade';
  @Input() placeholder: string = 'Selecione uma cidade';
  @Input() listaCidades: Cidade[] | null = [];
  @Input('cidadesJaSelecionadas')
  cidadesJaSelecionadasNoFormulario: (string | null)[] = [];

  selectedCidadeId: string | null = null;
  
  onChange: (value: string | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() { }

  ngOnInit(): void {}

  writeValue(id: string | null): void {
    this.selectedCidadeId = id;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value;
    
    this.selectedCidadeId = id;
    this.onTouched();
    this.onChange(id);
  }

  isCidadeDisponivel(cidade: Cidade): boolean {
    if (!this.cidadesJaSelecionadasNoFormulario) {
      return true;
    }
    const estaSelecionadaAqui = this.selectedCidadeId === cidade.id;
    const selecionadaEmOutroLugar = this.cidadesJaSelecionadasNoFormulario
      .some(idSelecionado => idSelecionado === cidade.id && idSelecionado !== this.selectedCidadeId);

    return estaSelecionadaAqui || !selecionadaEmOutroLugar;
  }
}