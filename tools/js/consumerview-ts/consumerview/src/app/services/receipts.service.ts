import { Injectable } from '@angular/core';

import { RECEIPTS } from '../mocks/receipts.mock';

@Injectable()
export class ReceiptsService {

  constructor() {}

  getReceipts() : String[] {
    return RECEIPTS;
  }
}
