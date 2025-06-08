import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Regiao } from 'src/app/core/models/regiao.model';
import { RegiaoService } from 'src/app/core/services/regiao.service';
import { tap } from 'rxjs/operators';
import { Cidade } from 'src/app/core/models/cidade.model';
import { MatDialog } from '@angular/material/dialog';
import { RegiaoFormComponent } from '../regiao-form/regiao-form.component';
import { RegiaoPayload } from 'src/app/core/models/regiao-payload.model';

@Component({
  selector: 'app-regiao-list',
  templateUrl: './regiao-list.component.html',
  styleUrls: ['./regiao-list.component.scss']
})
export class RegiaoListComponent implements OnInit {
  regioes$!: Observable<Regiao[]>; 
  mensagemErro: string | null = null;

    constructor(
    private regiaoService: RegiaoService,
    private dialog: MatDialog 
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
  if (!regiao) return;

  this.mensagemErro = null;
  const payload: RegiaoPayload = {
    nome: regiao.nome,
    cidadeIds: regiao.cidades.map(c => c.id), 
    ativo: !regiao.ativo 
  };

  this.regiaoService.updateRegiao(regiao.id, payload).subscribe({
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
    return cidades.map(c => c.nome).join(', ');
  }

  abrirModalDeRegiao(regiaoId: string | null = null): void {
  const dialogRef = this.dialog.open(RegiaoFormComponent, {
    width: '500px',        
    disableClose: true,   
    data: { id: regiaoId } 
  });


  dialogRef.afterClosed().subscribe(salvou => {
    if (salvou) {
      this.carregarRegioes();
    }
  });
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