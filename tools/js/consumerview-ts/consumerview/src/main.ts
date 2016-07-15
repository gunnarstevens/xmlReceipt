import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppComponent, environment } from './app/';
import { ReceiptsService} from './app/services/receipts.service';

if (environment.production) {
  enableProdMode();
}

// load the main angular component
bootstrap(AppComponent, [ReceiptsService]);
