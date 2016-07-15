import { Component } from '@angular/core';
import { ReceiptslistComponent } from './receiptslist/receiptslist.component';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ReceiptslistComponent]
})
export class AppComponent {
  title = 'app works!';
}
