import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

// BASICS
import { HTTP_PROVIDERS } from '@angular/http';
import 'rxjs/add/operator/toPromise';

// 3RD PARTY
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

import 'jquery';
import 'bootstrap';
import 'xml2json';

// OWN STUFF
import { AppComponent, environment } from './app/';
import { ReceiptsService} from './app/services/receipts.service';


if (environment.production) {
  enableProdMode();
}

// load the main angular component
bootstrap(AppComponent,
  [
    ReceiptsService,
    HTTP_PROVIDERS,
    FIREBASE_PROVIDERS,
  // Initialize Firebase app
    defaultFirebase({
      apiKey: "<your-key>",
      authDomain: "<your-project-authdomain>",
      databaseURL: "<your-database-URL>",
      storageBucket: "<your-storage-bucket>"
    })
  ]
);
