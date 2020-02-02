import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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

  public naverNews(options: NaverSearchOption): Observable<any> {
    const baseUrl = 'https://openapi.naver.com/v1/search/news.json';
    const header = new HttpHeaders()
      .set('X-Naver-Client-Id', '8ybYcNVjIBtojzBM1JlQ')
      .set('X-Naver-Client-Secret', 'HVV89BFs1v')
      .set('Access-Control-Allow-Origin', '*');
    const requestOptions = { headers: header };
    return this.backend.get(`${baseUrl}?query=${options.query}&display=${options.display}&start=${options.start}&sort=${options.sort}`, requestOptions);
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
