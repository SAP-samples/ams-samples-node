INTERNAL POLICY GetProducts {
    USE shopping.ReadProducts;
}

INTERNAL POLICY ExternalOrder {
    USE shopping.CreateOrders RESTRICT order.total < 100, product.category IS NOT RESTRICTED;
    USE shopping.DeleteOrders;
}