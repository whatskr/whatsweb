import {Component, ElementRef, OnInit, AfterViewInit, HostListener} from '@angular/core';
import {DataService} from '../data.service';
import {map} from 'rxjs/operators';

declare var kakao;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
  styles: [`
      .map {
          width: 100vw;
          height: calc(100vh - 50px);
          background-size: cover;
      }
      
      .layer_base {
          background: white;
          z-index: 999;
          border-radius: 10px;
          background: #ffffff;
          border: 2px solid #909090;
          opacity: 0.8;
      }
      
      .desc {
          font-size: 0.8rem;
          position: absolute;
          left: calc(100% - 280px);
          top: calc(100% - 50px);
          font-size: 0.7rem;
          border-radius: 0px !important;
          padding: 2px 2px 2px 2px;
      }

      .confirmedCountlayer {
          text-align: center;
          padding-top: 5px;
          position: relative;
          left: 10px;
          /*top: calc(-200px - 100%);*/
          margin-left: 4px;
          width: 130px;
          height: 65px;
      }

      .list-box {
          font-size: 0.8rem;
          position: relative;
          left: 10px;
          /*top: 190px;*/
          margin-left: 4px;
          width: 130px;
          /*height: 390px;*/
      }

      .item {
          font-size: 0.8rem;
          padding-top: 2px;
          padding-left: 5px;
          width: 100px;
          text-align: left;
          height: 18px;
      }
    
    .margin-zero {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit {

  isNoOverlay = true;

  map: any;

  checkedAll = true;
  isIndeteminate = false;

  baseData: any;
  viewData = [];

  places = [
    {name: '테스트', lat: 36.363775, lon: 127.346709}
  ];
  infowindow: any;

  innerHeight: any;
  selectAreaHeight = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = window.innerHeight;
  }

  constructor(private dataService: DataService, private elementRef: ElementRef)  {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const options = {
        center: new kakao.maps.LatLng(36.483946, 127.474166),
        level: 12
      };


      this.infowindow = new kakao.maps.InfoWindow({
        map: null,
        zIndex: 4,
        position: new kakao.maps.LatLng(36.370546, 127.345966),
        removable: false
      });


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

  ngOnInit() {
    this.innerHeight = window.innerHeight;
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
    this.infowindow.setMap(null);
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
      this.isIndeteminate = (isThereCheckedItem && isThereNoncheckedItem) ? true : false;
      this.checkedAll = !isThereNoncheckedItem;
    }
  }

  changeCheckbox(idx: number, $event) {
    this.viewData[idx - 1].display = $event.checked;
    this.viewData[idx - 1].polyline.setMap($event.checked ? this.map : null);
    if (!this.isNoOverlay) {
      this.viewData[idx - 1].markers.forEach(marker => {
        marker.setVisible($event.checked);
      });
    }
    this.viewData[idx - 1].realMarkers.forEach(marker => {
      marker.setVisible($event.checked);
    });
  }
  // -- ** Have to do a refactoring which of Event stuff ** //

  addOverlay() {
    this.selectAreaHeight = 20;
    const me = this;
    this.dataService.getMapdata().pipe(
      map(items => items.sort(this.sortByName))
    ).subscribe((data: [any]) => {
      data.forEach((row, idx) => {

        me.selectAreaHeight += 18.5;

        const obj = {
          seq: idx + 1,
          markers: [],
          realMarkers: [],
          polyline: null,
          title: row.title,
          contactTot: row.contactTot,
          color: row.color,
          display: true,
          popupMarkers: []
        };

        // draw markers
        const linePath = [];
        row.loc.forEach(loc => {
          const markerSvg = this.getOverlaySVG(obj.color);
          if (!this.isNoOverlay) {
            const marker = me.createOverlayMarker(loc.latitude, loc.longitude, markerSvg);
            obj.markers.push(marker);
          }

          /*
          const  imageSize = new kakao.maps.Size(64, 69);
          const  imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
          const markerImage = new kakao.maps.MarkerImage(markerSvg, imageSize, imageOption);

          // 실제 마커 추가
          const realMarker = new kakao.maps.Marker({
            clickable: true,
            position: new kakao.maps.LatLng(loc.latitude, loc.longitude),
            image: markerImage
          });
          */

          const markerImage = 'data:image/svg+xml;utf-8;base64,' + btoa(markerSvg);
          //const markerImage = 'data:image/svg+xml;utf8,' + markerSvg;

          const markerIcon = new kakao.maps.MarkerImage(
            markerImage,
            new kakao.maps.Size(40, 40),
            {offset: new kakao.maps.Point(20, 20)}
          );

          const realMarker = new kakao.maps.Marker({
            clickable: true,
            position: new kakao.maps.LatLng(loc.latitude, loc.longitude),
            image: markerIcon
          });

          realMarker.setMap(this.map);
          obj.realMarkers.push(realMarker);

          // 클릭 시 보이는 마커
          /*const overlay = new kakao.maps.CustomOverlay({
            content: '1212',
            map: null,
            position: realMarker.getPosition()
          });*/

          kakao.maps.event.addListener(realMarker, 'click', () => {
            this.infowindow.setContent(`<div style="padding:5px;width:250px; font-size: 0.8rem;">${loc.text}</div>`);
            this.infowindow.open(this.map, realMarker);
          });



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

    //확진자, 유증상자
    this.baseData = {};
    this.dataService.getBaseData().subscribe(data => {
      this.baseData.confirmed = data.confirmed;
      this.baseData.suspected = data.suspected;
    });


  }


  /*

  this.places.forEach(place => {
      const image = new kakao.maps.MarkerImage(
        'assets/img/marker.png',
        new kakao.maps.Size(64, 69),
        { offset: new kakao.maps.Point(27, 69) }
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

   */

  private createOverlayMarker(latitude: number, longitude: number, content: string) {
    const position = new kakao.maps.LatLng(latitude, longitude);
    const customOverlay = new kakao.maps.CustomOverlay({
      position: position,
      content: content,
      clickable: true
    });
    customOverlay.setMap(this.map);
    return customOverlay;
  }

  /*addPlaces() {
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
  }*/

  private sortByName(a, b) {
    if (a.confirmed < b.confirmed) {
      return 1;
    }
    if (a.confirmed > b.confirmed) {
      return -1;
    }
    return 0;
  }

  private getOverlaySVG(color: string) { //
    const svg = `<svg xmlns='http://www.w3.org/2000/svg'><circle fill-opacity='0.7' cx='18' cy='18' r='10' stroke='' stroke-width='1' fill='${color}' /></svg>`;
    return svg;
  }
}

