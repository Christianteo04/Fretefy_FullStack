import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Cidade } from 'src/app/core/models/cidade.model';
import { CidadeService } from 'src/app/core/services/cidade.service';

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

  cidades: Cidade[] = [];
  selectedCidadeId: string | null = null;
  isDisabled = false;

  onChange: (value: string | null) => void = () => { };
  onTouched: () => void = () => { };

  constructor(private cidadeService: CidadeService) { }

  ngOnInit(): void {
    this.cidadeService.getCidades().subscribe({
      next: (cidades) => {
        this.cidades = cidades;
        // Force Angular to re-apply the [value] binding after options render.
        // writeValue() may have been called before cities loaded (edit mode),
        // so we need to reset and re-set the value on the next tick.
        if (this.selectedCidadeId) {
          const currentId = this.selectedCidadeId;
          this.selectedCidadeId = null;
          setTimeout(() => {
            this.selectedCidadeId = currentId;
          });
        }
      },
      error: (err) => {
        console.error('Erro ao carregar cidades:', err);
        this.cidades = [];
      }
    });
  }

  writeValue(id: string | null): void {
    this.selectedCidadeId = id;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const id = selectElement.value || null;

    this.selectedCidadeId = id;
    this.onTouched();
    this.onChange(id);
  }
}