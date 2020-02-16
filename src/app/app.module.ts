import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import {DeleteHtmlTags, NewsComponent} from './news/news.component';
import {CountsComponent, KoreaHighlight} from './counts/counts.component';
import {DataService} from './data.service';
import {HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule, MatCheckboxModule} from '@angular/material';
import {FormsModule} from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NewsComponent,
    CountsComponent,

    KoreaHighlight,
    DeleteHtmlTags,

    FooterComponent,

    NavComponent
  ],
  exports: [
    CountsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    FormsModule,

    // Angular Material
    MatCheckboxModule,
    MatCardModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
