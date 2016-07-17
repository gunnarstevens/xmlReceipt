import { Component, NgZone } from '@angular/core';
import { ReceiptsOutlineViewComponent } from './receiptsoutlineview/receiptsoutlineview.component';
import { TestfireComponent} from './testfire/testfire.component';
import {UPLOAD_DIRECTIVES} from '../ng2-uploader';

@Component({
  moduleId: module.id,
  selector: 'cv-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ReceiptsOutlineViewComponent, TestfireComponent, UPLOAD_DIRECTIVES]
})
export class AppComponent {
  zone: NgZone;
  dropProgress: number = 0;
  dropResp: any[] = [];

  options: Object = {
    url: 'http://test.com/upload'
  };
  constructor() {
    this.zone = new NgZone({ enableLongStackTrace: false });
  }


  handleDropUpload(data): void {
    let index = this.dropResp.findIndex(x => x.id === data.id);
    if (index === -1) {
      this.dropResp.push(data);
    }
    else {
      this.zone.run(() => {
        this.dropResp[index] = data;
      });
    }

    let total = 0, uploaded = 0;
    this.dropResp.forEach(resp => {
      total += resp.progress.total;
      uploaded += resp.progress.loaded;
    });

    this.dropProgress = Math.floor(uploaded / (total / 100));
  }
}
