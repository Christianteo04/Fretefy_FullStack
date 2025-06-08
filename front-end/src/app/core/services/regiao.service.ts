import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { Regiao } from '../models/regiao.model';
import { RegiaoPayload } from '../models/regiao-payload.model';

@Injectable({
  providedIn: 'root'
})
export class RegiaoService {

  private apiUrlBase = environment.apiUrl;
  private resourceUrl = `${this.apiUrlBase}/regiao`; 

  constructor(private http: HttpClient) { }

  getRegioes(): Observable<Regiao[]> {
    return this.http.get<Regiao[]>(this.resourceUrl)
      .pipe(catchError(this.handleError));
  }
  

  getRegiaoById(id: string): Observable<Regiao> {
    const url = `${this.resourceUrl}/${id}`;
    return this.http.get<Regiao>(url)
      .pipe(catchError(this.handleError));
  }


  createRegiao(payload: RegiaoPayload): Observable<Regiao> {
    return this.http.post<Regiao>(this.resourceUrl, payload)
      .pipe(catchError(this.handleError));
  }


  updateRegiao(id: string, payload: RegiaoPayload): Observable<void> {
    const url = `${this.resourceUrl}/${id}`;

    return this.http.put<void>(url, payload) 
      .pipe(catchError(this.handleError));
  }
  
  toggleAtivo(id: string): Observable<Regiao> {
    const url = `${this.resourceUrl}/${id}/toggle-ativo`;
    return this.http.put<Regiao>(url, null) 
      .pipe(catchError(this.handleError));
  }

private handleError(error: HttpErrorResponse) {

  let errorMessage = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

  if (error.status === 400 && error.error && typeof error.error === 'string') {
    errorMessage = error.error;
  }
  else if (error.status === 0) {
    errorMessage = 'Não foi possível conectar ao servidor.';
  }
  else if (error.status >= 500) {
     errorMessage = `Erro interno no servidor (${error.status}). Por favor, contate o suporte.`
  }

  return throwError(new Error(errorMessage)); 
}

  async exportarRegioesParaExcel(): Promise<void> {

    const url = `${this.resourceUrl}/export`; 

    const response = await this.http.get(url, { responseType: 'blob' }).toPromise();
    if (response) {

      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const urlBlob = window.URL.createObjectURL(blob);

      const contentDisposition = (response as any).headers?.get('Content-Disposition');
      let filename = `Regioes_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.xlsx`; 

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-8'')?([^"']*)['"]?/i);
        if (filenameMatch && filenameMatch[1]) {
          try {
            filename = decodeURIComponent(filenameMatch[1]);
          } catch (e) {
            console.warn("Erro ao decodificar o nome do arquivo do Content-Disposition. Usando nome padrão.", e);
          }
        }
      }

      const a = document.createElement('a');
      a.href = urlBlob;
      a.download = filename; 
      document.body.appendChild(a);
      a.click(); 
      window.URL.revokeObjectURL(urlBlob); 
      document.body.removeChild(a); 
    } else {
      throw new Error("Nenhuma resposta de arquivo recebida.");
    }
  }
}