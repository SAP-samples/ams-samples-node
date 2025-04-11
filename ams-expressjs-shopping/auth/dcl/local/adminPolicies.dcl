POLICY OrderAccessory {
    USE shopping.CreateOrders RESTRICT product.category = 'accessory', order.total IS NOT RESTRICTED;
}