import { bootstrap } from 'angular2/platform/browser';
//import { bootstrap2 } from '@angular/platform-browser-dynamic';
import {AppComponent} from "./components/app.component";
import { ReceiptsService} from './services/receipts.service';


// load the main angular component
// bootstrap(AppComponent);
bootstrap(AppComponent, [ReceiptsService]);
