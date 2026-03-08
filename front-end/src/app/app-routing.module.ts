import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/regiao',
    pathMatch: 'full'
  },
  {
    path: 'home',
    redirectTo: '/regiao',
    pathMatch: 'full'
  },
  {
    path: 'regiao',
    loadChildren: () => import('./modules/regiao/regiao.module').then(m => m.RegiaoModule)
  },
  { 
    path: '**', 
    redirectTo: '/regiao' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
