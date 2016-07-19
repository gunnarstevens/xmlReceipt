##receipts

+ costumerview
   + users
    + username*
      + receipt_ids
        + receiptid*
      + receipt_content
        + receiptid*
          + xmlreceipt
      + home_inventory
        + home_items
          + home_item_ids*
        

pseudcode - add receipt

  add(xmlreceipt, username) 
    create new receiptid
    insert username.receiptid
    insert username.receiptid.xmlreceipt
    
    
    sideeffect
  => update username.receiptid *
  
    => update receiptoutlineview
    => update receiptview
    
    
  
      
