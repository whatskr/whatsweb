import {Component, OnInit} from '@angular/core';
import {DataService, NaverSearchOption, SortOption} from '../data.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass']
})
export class NewsComponent implements OnInit {

  newsData: [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    const options: NaverSearchOption = {
      query: '신종 코로나바이러스',
      display: 5,
      start: 1,
      sort: SortOption.date
    };

    /*this.dataService.naverNews(options).subscribe((data) => {
      console.log(data);
      this.newsData = data;
    });*/
  }


}
