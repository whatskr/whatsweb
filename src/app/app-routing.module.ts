import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MapComponent} from './map/map.component';
import {NewsComponent} from './news/news.component';
import {CountsComponent} from './counts/counts.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';


const routes: Routes = [
  { path: 'map', component: MapComponent },
  { path: 'news', component: NewsComponent },
  { path: 'stats', component: CountsComponent },
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: '/map'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppRoutingModule { }
