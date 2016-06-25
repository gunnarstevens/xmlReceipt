# Example

```xml
<xmlreceipt>

  <seller>
    <sellername>REWE Markt GmbH</sellername>
    <sellerid>
      <duns>100</duns>
      <sellerid>string</sellerid>
    </sellerid>
    <vatin>DE 812 706 034</vatin>
    <uri>https://www.rewe.de/</uri>
    <selleraddress>
        REWE Markt GmbH
        Domstraße 20
        50668 Köln
    </selleraddress>
    <aspect>
      <aspectName>newsletter/aspectName>
      <aspectValue>https://www.rewe.de/service/newsletter/</aspectValue>
    </aspect>
  </seller>
  
  <total>
    <purchasedate>2016-06-25</purchasedate>
    <totalquantity>
      <totalProducts>2</totalProducts>
      <totalUnits>1</totalUnits>
    </totalquantity>
    <totalprice>
      <currency>EUR</currency>
      <totalNetValue>5.98</totalNetValue>
    </totalprice>
    <aspect>
      <aspectName>paypackpoints</aspectName>
      <aspectValue>4</aspectValue>
    </aspect>
  </total>
  
  <itemlist>
    <item units="2">
      <itemName>Original Wagner Big Pizza BBQ-Chicken</itemName>
      <itemid>
        <ean>4009233012084</ean>
        <selleritemid>2670477</selleritemid>
        <rsin>2670477</rsin>
      </itemid>
      <dates>
        <bestbefore>2017-09-29T03:49:45</bestbefore>
      </dates>
      <price>
        <currency>EUR</currency>
        <itemvalue>2.99</itemvalue>
      </price>
      <quantity>
        <gramm>425</gramm>
      </quantity>
      <itemgroup>
        <eclass>
          <classificationid>16-14-90-90</classificationid>
          <language>DE-de</language>
          <classificationname>Fertiggericht, Halbfertiggericht (Sonstige, nicht spezifiziert)</classificationname>          
        </eclasscategory>
        <sellercategory>
            <classificationid>https://shop.rewe.de/productList?selectedFacets=category%3DTiefk%25C3%25BChl%2FPizza%2520%2526%2520Fertiggerichte%2FPizza%2FPizza%2520H%25C3%25BChnchen</classificationid>
            <language>DE-de</language>
            <classificationname>Pizza Hühnchen</classificationname>          
        </sellercategory>
      </itemgroup>
      <infosheet>
        <uri>https://shop.rewe.de/tiefkuehl/pizza-huehnchen/original-wagner-big-pizza-bbq-chicken-425g/PD2670477?infosheet.php</uri>
      </infosheet>
      <aspect>
        <aspectName>foodtype</aspectName>
        <aspectValue>frozenfood</aspectValue>
      </aspect>
    </item>
  </itemlist>
</xmlreceipt>

```

