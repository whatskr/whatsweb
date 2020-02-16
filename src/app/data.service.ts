import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private BACKEND_PREFIX = 'http://localhost:4200';

  constructor(private backend: HttpClient) { }

  public counts(): Observable<any> {
    // return this.backend.get(`${this.BACKEND_PREFIX}/datas/counts.json`);
    return this.backend.get('assets/counts.json');
  }

  public getNaverNews(): Observable<any> {
    return this.backend.get(environment.newsUrl);
  }

  public getBaseData(): Observable<any> {
    return this.backend.get('assets/base.json');
  }

  public getMapdata(): Observable<any> {
    return this.backend.get('assets/mapdata.json');
  }
}
export interface NaverSearchOption {
  query: string;
  display: number;
  start: number;
  sort: SortOption;
}

export enum SortOption {
  sim = 'sim',
  date = 'date'
}
