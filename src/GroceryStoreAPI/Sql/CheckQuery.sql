SELECT StockQuantity 
FROM Product 
WITH (UPDLOCK, ROWLOCK) 
WHERE ProductId = @ProductId;