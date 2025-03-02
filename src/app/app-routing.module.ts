import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebPageComponent } from './components/web-page/web-page.component';

const routes: Routes = [
  { 
    path: 'web',
    component: WebPageComponent
  },
  { 
    path: '**', 
    redirectTo: 'web', 
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
