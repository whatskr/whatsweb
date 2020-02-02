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
          background: #f5f5f5;
      }

      .item {
          font-size: 0.8rem;
          padding-top: 2px;
          padding-left: 5px;
          width: 100px;
          text-align: left;
          height: 30px;
      }
  `]
})
export class MapComponent implements OnInit {

  map: any;
  infowindow: any;

  viewData = [];

  // 마커들
  places = [
    {name: '공대2호관 쪽문나가는길', lat: 36.363775, lon: 127.346709},
    {name: '공대2호관 뒷길(초등학교사이)', lat: 36.364176, lon: 127.347213},
    {name: '체육관 좌측', lat: 36.371124, lon: 127.341466},
    {name: '박물관뒤 주차장', lat: 36.370845, lon: 127.345263}
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

  onChange(idx: number, $event) {
    if ($event.checked) {
      this.viewData[idx - 1].polyline.setMap(this.map);
      this.viewData[idx - 1].markers.forEach(marker => {
        marker.setVisible(true);
      });
    } else {
      this.viewData[idx - 1].polyline.setMap(null);
      this.viewData[idx - 1].markers.forEach(marker => {
        marker.setVisible(false);
      });
    }

  }

  addOverlay() {
    const me = this;
    this.dataService.getMapdata().pipe(
      map(items => items.sort(this.sortByName))
    ).subscribe((data: [any]) => {
      data.forEach((row, idx) => {
        //TODO: draw info-box on the leftside of Map

        const obj = {
          seq: idx + 1,
          markers: [],
          polyline: null,
          title: row.title,
          contactTot: row.contactTot,
          color: row.color,
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
          path: linePath, // 선을 구성하는 좌표배열 입니다
          strokeWeight: 2, // 선의 두께 입니다
          strokeColor: obj.color, // 선의 색깔입니다
          strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid' // 선의 스타일입니다
        });
        polyline.setMap(this.map);
        obj.polyline = polyline;
        // TODO: add arrows


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

