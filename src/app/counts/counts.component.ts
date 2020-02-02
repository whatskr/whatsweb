import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {map} from 'rxjs/operators';
import { Directive } from '@angular/core';

@Component({
  selector: 'app-counts',
  templateUrl: './counts.component.html',
  styleUrls: ['./counts.component.sass']
})
export class CountsComponent implements OnInit {

  datas: [];

  constructor(private dataService: DataService) { }

  private sortByName(a, b) {
    if (a.confirmed < b.confirmed) {
      return 1;
    }
    if (a.confirmed > b.confirmed) {
      return -1;
    }
    return 0;
  }

  ngOnInit() {

    this.dataService.counts().pipe(
      map(items => items.sort(this.sortByName))
    ).subscribe((data) => {
      console.log(data);
      this.datas = data;
    });
  }
}

@Directive({
  selector: '[koreaHighlight]'
})
export class KoreaHighlight {

  @Input('koreaHighlight') set koreaHighlight(flag) {
    if (flag === 'kr') {
      this.el.nativeElement.style.fontWeight = '800';
    }
  }

  constructor(private el: ElementRef) {}
}
