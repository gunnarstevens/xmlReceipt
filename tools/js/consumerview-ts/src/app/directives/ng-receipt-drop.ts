import {Directive, ElementRef, EventEmitter} from '@angular/core';

import {xmlreceipt} from "../model/receipt.model";
import {ReceiptsService} from "../services/receipts.service";

// TODO adapt class to check if a receipt file was drop and if so send it to the receipt-uploader service

@Directive({
  selector: '[ng-receipt-drop]',
  inputs: ['options: ng-receipt-drop'],
  outputs: ['onUpload'],
  host: { '(change)': 'onFiles()' }
})
export class NgReceiptDrop {
  options: any;
  onUpload: EventEmitter<any> = new EventEmitter();

  // scoping hack
  private static receiptsService : ReceiptsService;

  constructor(public el: ElementRef, receiptsService: ReceiptsService) {
    NgReceiptDrop.receiptsService = receiptsService;

    this.initEvents();
  }

  initEvents(): void {
    this.el.nativeElement.addEventListener('drop', (e) => {
      e.stopPropagation();
      e.preventDefault();

      let dt = e.dataTransfer;
      let files = dt.files;

      var answer = confirm("Should the receipt added to your ConsumerView repository?");

      if (answer == true) {
        if (files.length == 1) {
          var reader : any = new FileReader();
          reader.onload = function (e: any) {
            var receipt : Object = new X2JS().xml_str2json((<FileReader> e.target).result);
            var content = new xmlreceipt(receipt);

             NgReceiptDrop.receiptsService.addReceipt(content);
          }
          reader.readAsText(files.item(0));        }
      } else {
        // do nothing
      }
    }, false);

    this.el.nativeElement.addEventListener('dragenter', (e) => {
      e.stopPropagation();
      e.preventDefault();
    }, false);

    this.el.nativeElement.addEventListener('dragover', (e) => {
      e.stopPropagation();
      e.preventDefault();
    }, false);
  }
}
