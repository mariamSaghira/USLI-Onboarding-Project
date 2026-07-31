UPDATE Product
SET StockQuantity = StockQuantity - @Quantity
WHERE ProductId = @ProductId;