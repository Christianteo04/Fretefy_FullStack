import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { Cidade } from '../models/cidade.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private apiUrlBase = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCidades(params: { uf?: string; terms?: string } = {}): Observable<Cidade[]> {
    const apiUrl = `${this.apiUrlBase}/cidade`;

    let httpParams = new HttpParams();
    if (params.uf) {
      httpParams = httpParams.set('uf', params.uf);
    }
    if (params.terms) {
      httpParams = httpParams.set('terms', params.terms);
    }
    return this.http.get<Cidade[]>(apiUrl, { params: httpParams });
  }
}