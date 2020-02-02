import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {map} from 'rxjs/operators';

declare var kakao;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
  styles: [`
      .map {
          width: 99vw;
          height: 80vh;
          background-size: cover;
      }

      .list-box {
          font-size: 0.8rem;
          position: absolute;
          margin-top: -718px;
          margin-left: 4px;
          z-index: 998;
          background: white;
          width: 100px;
          height: 500px;
          border-radius: 10px;
          background: #e8e8e8;
          border: 2px solid #737373;
          opacity: 0.8;
      }

      .item {
          font-size: 0.8rem;
          padding-top: 2px;
          padding-left: 5px;
          width: 100px;
          text-align: left;
          height: 30px;
      }
    
    .margin-zero {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }
  `]
})
export class MapComponent implements OnInit {

  map: any;
  infowindow: any;

  checkedAll = true;
  isIndeteminate = false;

  viewData = [];

  places = [
    {name: '테스트', lat: 36.363775, lon: 127.346709}
  ];

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    setTimeout(() => {
      const options = {
        center: new kakao.maps.LatLng(36.483946, 127.474166),
        level: 12
      };

      this.map = new kakao.maps.Map(document.getElementById('map'), options);

      /*this.infowindow = new kakao.maps.InfoWindow({
        map: this.map,
        zIndex: 4,
        position: new kakao.maps.LatLng(36.370546, 127.345966),
        removable: true
      });*/

      // Sample : custom overlay
      /*const position = new kakao.maps.LatLng(33.450701, 126.570667);
      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: this.getOverlaySVG('red')
      });
      customOverlay.setMap(this.map);*/

      this.addOverlay();
    }, 300);
  }

  // ** Have to do a refactoring which of Event stuff ** //
  onToggleAll() {
    console.log('this.checkedAll', this.checkedAll);
    this.viewData.forEach((row, idx) => {
      row.display = this.checkedAll;
      console.log(row.display);
      this.onChange(idx + 1, {checked: this.checkedAll}, 'NOT NULL');
    });
    this.isIndeteminate = false;
  }

  onChange(idx: number, $event, caller) {
    this.changeCheckbox(idx, $event);

    let isThereCheckedItem = false;
    let isThereNoncheckedItem = false;
    if (caller == null) {
      console.log('here');
      this.viewData.forEach(row => {
          if (row.display) {
            isThereCheckedItem = true;
          } else {
            isThereNoncheckedItem = true;
          }
      });
      this.isIndeteminate = (isThereCheckedItem && isThereDischeckedItem) ? true : false;
      this.checkedAll = !isThereNoncheckedItem;
    }
  }

  changeCheckbox(idx: number, $event) {
    this.viewData[idx - 1].display = $event.checked;
    this.viewData[idx - 1].polyline.setMap($event.checked ? this.map : null);
    this.viewData[idx - 1].markers.forEach(marker => {
      marker.setVisible($event.checked);
    });
  }
  // -- ** Have to do a refactoring which of Event stuff ** //

  addOverlay() {
    const me = this;
    this.dataService.getMapdata().pipe(
      map(items => items.sort(this.sortByName))
    ).subscribe((data: [any]) => {
      data.forEach((row, idx) => {

        const obj = {
          seq: idx + 1,
          markers: [],
          polyline: null,
          title: row.title,
          contactTot: row.contactTot,
          color: row.color,
          display: true,
        };

        // draw markers
        const linePath = [];
        row.loc.forEach(loc => {
          obj.markers.push(
            me.createOverlayMarker(loc.latitude, loc.longitude, obj.color)
          );
          linePath.push(new kakao.maps.LatLng(loc.latitude, loc.longitude));
        });

        // draw lines
        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 2,
          strokeColor: obj.color,
          strokeOpacity: 0.8,
          strokeStyle: 'solid',
          endArrow: true,
        });
        polyline.setMap(this.map);
        obj.polyline = polyline;

        me.viewData.push(obj);
      });
      console.log(me.viewData);
    });
  }

  private createOverlayMarker(latitude: number, longitude: number, markerColor: string) {
    const position = new kakao.maps.LatLng(latitude, longitude);
    const customOverlay = new kakao.maps.CustomOverlay({
      position: position,
      content: this.getOverlaySVG(markerColor)
    });
    customOverlay.setMap(this.map);
    return customOverlay;
  }

  addPlaces() {
    this.places.forEach(place => {
      const image = new kakao.maps.MarkerImage(
        'assets/img/marker.png',
        new kakao.maps.Size(64, 69),
        {offset: new kakao.maps.Point(27, 69)}
      );

      const marker = new kakao.maps.Marker({
        clickable: true,
        position: new kakao.maps.LatLng(place.lat, place.lon),
        image
      });

      marker.setMap(this.map);

      // 클릭했을때 마커위에 인포윈도우 그리기
      kakao.maps.event.addListener(marker, 'click', () => {
        this.infowindow.setContent(`<div style="padding:5px;width:250px;">${place.name}</div>`);
        this.infowindow.open(this.map, marker);
      });

      this.infowindow.setContent(`<div style="padding:5px;width:250px;">${place.name}</div>`);
      this.infowindow.open(this.map, marker);
    });
  }

  private sortByName(a, b) {
    if (a.confirmed < b.confirmed) {
      return 1;
    }
    if (a.confirmed > b.confirmed) {
      return -1;
    }
    return 0;
  }

  private getOverlaySVG(color: string) {
    const svg = `<svg height="40" width="40"><circle fill-opacity="0.4" cx="18" cy="18" r="14" stroke="black" stroke-width="1" fill="${color}" /></svg>`;
    return svg;
  }
}

