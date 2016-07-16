import { Component } from '@angular/core';
import { ReceiptsOutlineViewComponent } from './receiptsoutlineview/receiptsoutlineview.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ReceiptsOutlineViewComponent]
})
export class AppComponent {
  title = 'app works fine!';
}
