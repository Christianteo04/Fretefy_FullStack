import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegiaoService } from 'src/app/core/services/regiao.service';
import { Regiao } from 'src/app/core/models/regiao.model';
import { RegiaoPayload } from 'src/app/core/models/regiao-payload.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-regiao-form',
  templateUrl: './regiao-form.component.html',
  styleUrls: ['./regiao-form.component.scss']
})
export class RegiaoFormComponent implements OnInit {
  regiaoForm!: FormGroup;
  isEditMode = false;
  regiaoId: string | null = null;
  regiaoAtivo = true;
  isLoading = false;
  mensagemErro: string | null = null;
  mensagemSucesso: string | null = null;

  constructor(
    private fb: FormBuilder,
    private regiaoService: RegiaoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.regiaoId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.regiaoId;

    this.initForm();

    if (this.isEditMode) {
      this.carregarRegiaoParaEdicao();
    } else {
      this.addCidade();
    }
  }

  initForm(): void {
    this.regiaoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cidades: this.fb.array([], [this.minCidadesValidator(1)])
    });
  }

  carregarRegiaoParaEdicao(): void {
    if (!this.regiaoId) return;

    this.isLoading = true;
    this.regiaoService.getRegiaoById(this.regiaoId).subscribe({
      next: (regiao: Regiao) => {
        this.regiaoAtivo = regiao.ativo;
        this.regiaoForm.patchValue({ nome: regiao.nome });
        this.cidadesFormArray.clear();

        regiao.cidades.forEach(cidade => {
          this.addCidade(cidade.id);
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.mensagemErro = err.message || 'Falha ao carregar dados da região.';
        setTimeout(() => this.router.navigate(['/regiao']), 2000);
      }
    });
  }

  get nomeFormControl(): FormControl {
    return this.regiaoForm.get('nome') as FormControl;
  }

  get cidadesFormArray(): FormArray {
    return this.regiaoForm.get('cidades') as FormArray;
  }

  addCidade(cidadeId: string | null = null): void {
    const cidadeFormControl = this.fb.control(cidadeId, [Validators.required, this.uniqueCidadeValidator.bind(this)]);
    this.cidadesFormArray.push(cidadeFormControl);
  }

  removeCidade(index: number): void {
    this.cidadesFormArray.removeAt(index);
  }

  onSubmit(): void {
    this.mensagemErro = null;
    this.mensagemSucesso = null;

    if (this.regiaoForm.invalid) {
      this.regiaoForm.markAllAsTouched();
      this.mensagemErro = "Formulário inválido. Verifique os campos.";
      return;
    }

    this.isLoading = true;
    const formValue = this.regiaoForm.value;

    const payload: RegiaoPayload = {
      nome: formValue.nome,
      ativo: this.isEditMode ? this.regiaoAtivo : true,
      cidadeIds: formValue.cidades.filter((id: string | null) => id !== null) as string[]
    };

    let operacao: Observable<any>;

    if (this.isEditMode && this.regiaoId) {
      operacao = this.regiaoService.updateRegiao(this.regiaoId, payload);
    } else {
      operacao = this.regiaoService.createRegiao(payload);
    }

    operacao.subscribe({
      next: () => {
        this.isLoading = false;
        this.mensagemSucesso = 'Região salva com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/regiao']);
        }, 1500);
      },
      error: (err: Error) => {
        this.isLoading = false;
        this.mensagemSucesso = null;

        let finalMessage = err.message;
        if (finalMessage.startsWith('Error: ')) {
          finalMessage = finalMessage.substring('Error: '.length);
        }
        this.mensagemErro = finalMessage;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/regiao']);
  }

  minCidadesValidator(min: number) {
    return (formArray: AbstractControl): { [key: string]: any } | null => {
      if ((formArray as FormArray).controls.filter(control => control.value !== null).length >= min) {
        return null;
      }
      return { 'minCidades': { requiredMin: min, actual: (formArray as FormArray).length } };
    };
  }

  uniqueCidadeValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!control.parent) {
      return null;
    }

    const formArray = control.parent as FormArray;
    const currentValueId = control.value;

    if (!currentValueId)
      return null;

    const count = formArray.controls
      .filter(ctrl => ctrl !== control)
      .map(ctrl => ctrl.value)
      .filter(id => id === currentValueId)
      .length;

    return count > 0 ? { 'cidadeDuplicada': true } : null;
  }
}