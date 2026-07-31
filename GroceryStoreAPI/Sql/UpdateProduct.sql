UPDATE Product
SET ProductName = @ProductName,
    Weight = @Weight,
    Price = @Price,
    StockQuantity = @StockQuantity,
    IsPerPound = @IsPerPound,
    Category = @Category
WHERE ProductID = @ProductID;