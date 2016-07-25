/**
 *
 */
export class ReceiptHeader {
  id: number;
  name: string;
  iconUrl : string;
}
/**
 *
 */
export class xmlreceipt {

  // primary identifier of the xml receipt
  key : String;

  // content of the receipt followed by the xmlreceipt standard translated to JSON e.g. using xml2json
  xmlReceipt : Object;

  constructor(xmlReceipt : Object) {
    this.xmlReceipt = xmlReceipt;
    this.key = "key";
  }
}
