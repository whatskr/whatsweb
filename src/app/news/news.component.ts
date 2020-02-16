import {Component, Directive, ElementRef, Input, OnInit, Pipe, PipeTransform} from '@angular/core';
import {DataService, NaverSearchOption, SortOption} from '../data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass']
})
export class NewsComponent implements OnInit {

  newsData: any;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getNaverNews().subscribe((data) => {
      this.newsData = data.items;
    });
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }
}

@Pipe({name: 'deleteHtmlTags'})
export class DeleteHtmlTags implements PipeTransform {
  transform(value: string, ...args): string {
    console.log('delete html');
    return value.replace(/(<([^>]+)>)/ig, '');
  }
}
