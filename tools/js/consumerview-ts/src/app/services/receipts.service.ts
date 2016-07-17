import $ = require('jquery');
import { Injectable } from '@angular/core';
import { RECEIPTS } from '../mocks/receipts.mock';
import { Headers, Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';


declare var require : any;


export class Receipt {
  id: number;
  name: string;
  iconUrl : string;
}

@Injectable()
export class ReceiptsService {

  receiptsUrl : string = "../data/receipt1.xml";

  constructor(private http: Http) {}


  getReceipts() : Promise<Receipt[]> {

    // TODO - get data from firebase
    return this.http.get(this.receiptsUrl).toPromise().then(res => {return RECEIPTS;
    });
  }

  getReceipt(uri : string) : Promise<Receipt> {
    return this.http.get(this.receiptsUrl).toPromise().then(res => {

      var xml2js:IX2JS = new X2JS();
      var xml = "<root>Hello xml2js!</root>"
      var receipt : Object = xml2js.xml_str2json(xml);
      console.log("ReceiptsService parse XML: " + receipt);

      return receipt;
    });
  }
}
