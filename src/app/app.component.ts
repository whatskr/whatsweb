import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [`
      .layer {
          background: white;
          z-index: 999;
          border-radius: 10px;
          background: #ffffff;
          border: 2px solid #909090;
          opacity: 0.8;

          font-size: 0.8rem;
          position: absolute;
          left: 10px;
          top: 585px;
          margin-left: 4px;
          width: 130px;
          height: 110px;
      }

      .menu {
          list-style: none;
          padding: 5px 0px 0px 0px;
          text-align: center;
      }

      li {
          margin-bottom: 5px;
          font-weight: bold;
          color: #4e494e;
          cursor: pointer;
      }

      .title {
          text-align: center;
          font-size: 1.2rem;
          color: #004eb1;
          border-bottom: 0.5px solid #c7c7c7;
      }
  `]
})
export class AppComponent {
  title = 'whatsweb';
}

