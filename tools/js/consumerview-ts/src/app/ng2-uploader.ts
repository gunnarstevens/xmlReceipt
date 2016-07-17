import {Ng2Uploader} from './services/ng2-uploader';
import {NgFileSelect} from './directives/ng-file-select';
import {NgFileDrop} from './directives/ng-file-drop';
import {NgReceiptDrop} from './directives/ng-receipt-drop';

export * from './services/ng2-uploader';
export * from './directives/ng-file-select';
export * from './directives/ng-file-drop';
export * from './directives/ng-receipt-drop';

export default {
  directives: [NgFileSelect, NgFileDrop],
  providers: [Ng2Uploader]
}

export const UPLOAD_DIRECTIVES: [any] = [NgFileSelect, NgFileDrop, NgReceiptDrop];
