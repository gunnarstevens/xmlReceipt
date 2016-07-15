/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RECEIPTS } from '../../mocks/receipts.mock';
import {ReceiptsService} from '../../services/receipts.service'
import { ReceiptslistComponent } from './receiptslist.component';

import {
  beforeEach, beforeEachProviders,
  describe, xdescribe,
  expect, it, xit,
  async, inject
} from '@angular/core/testing';

describe('Component: Receiptslist', () => {
  it('should create an instance', () => {
    let component = new ReceiptslistComponent(new ReceiptsService());
    expect(component).toBeTruthy();
  });

  it('should create an instance', () => {
    let component = new ReceiptslistComponent(new ReceiptsService());
    component.ngOnInit();
    expect(component.getReceipts()).toEqual(RECEIPTS);
  });
});
