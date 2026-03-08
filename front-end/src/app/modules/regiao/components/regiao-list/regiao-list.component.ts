import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Regiao } from 'src/app/core/models/regiao.model';
import { RegiaoService } from 'src/app/core/services/regiao.service';
import { tap } from 'rxjs/operators';
import { Cidade } from 'src/app/core/models/cidade.model';

@Component({
  selector: 'app-regiao-list',
  templateUrl: './regiao-list.component.html',
  styleUrls: ['./regiao-list.component.scss']
})
export class RegiaoListComponent implements OnInit {
  regioes$!: Observable<Regiao[]>;
  mensagemErro: string | null = null;

  constructor(
    private regiaoService: RegiaoService
  ) { }

  ngOnInit(): void {
    this.carregarRegioes();
  }

  carregarRegioes(): void {
    this.mensagemErro = null;
    this.regioes$ = this.regiaoService.getRegioes().pipe(
      tap({
        error: err => this.mensagemErro = err.message || 'Falha ao carregar regiões.'
      })
    );
  }

  toggleAtivo(regiao: Regiao): void {
    if (!regiao || !regiao.id) return;

    this.mensagemErro = null;
    this.regiaoService.toggleAtivo(regiao.id).subscribe({
      next: () => {
        this.carregarRegioes();
      },
      error: err => {
        this.mensagemErro = err.message || 'Falha ao atualizar status da região.';
      }
    });
  }

  getCidadesNomes(cidades: Cidade[]): string {
    if (!cidades || cidades.length === 0) return 'Nenhuma';
    return cidades.map(c => `${c.nome} (${c.uf})`).join(', ');
  }

  async exportarParaExcel(): Promise<void> {
    try {
      this.mensagemErro = null;
      await this.regiaoService.exportarRegioesParaExcel();
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      this.mensagemErro = 'Erro ao exportar regiões para Excel. Tente novamente.';
    }
  }
}