import { Component } from '@angular/core';
import { ReceiptsOutlineViewComponent } from './receiptsoutlineview/receiptsoutlineview.component';
import { TestfireComponent} from './testfire/testfire.component';

@Component({
  moduleId: module.id,
  selector: 'cv-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ReceiptsOutlineViewComponent, TestfireComponent]
})
export class AppComponent {}
