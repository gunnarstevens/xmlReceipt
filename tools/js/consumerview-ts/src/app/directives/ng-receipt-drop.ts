import {Directive, ElementRef, EventEmitter} from '@angular/core';
import {Ng2Uploader} from '../services/ng2-uploader';

// TODO adapt class to check if a receipt file was drop and if so send it to the receipt-uploader service

@Directive({
  selector: '[ng-receipt-drop]',
  inputs: ['options: ng-receipt-drop'],
  outputs: ['onUpload'],
  host: { '(change)': 'onFiles()' }
})
export class NgReceiptDrop {
  uploader: Ng2Uploader;
  options: any;
  onUpload: EventEmitter<any> = new EventEmitter();

  constructor(public el: ElementRef) {
    this.uploader = new Ng2Uploader();
    setTimeout(() => {
      this.uploader.setOptions(this.options);
    });

    this.uploader._emitter.subscribe((data) => {
      this.onUpload.emit(data);
    });

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
          this.getReceipt(files.item(0));
          this.uploader.addFilesToQueue(files);
        }
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

  getReceipt(file : File) {
    var reader = new FileReader();
    var reader = new FileReader();
    reader.result
    reader.onload = function(e) {
      var xml = (<FileReader> e.target).result;

      console.log("Ng-Receipt Drop read XML: " + xml);

      var xml2js:IX2JS = new X2JS();
      var receipt : Object = xml2js.xml_str2json(xml);
      console.log("Ng-Receipt Drop parse XML: " + receipt);
    }
    reader.readAsText(file);
  }
}
