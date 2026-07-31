INSERT INTO Product (
       ProductName, 
       Weight, 
       Price, 
       StockQuantity, 
       IsPerPound, 
       Category)  
VALUES (
        @ProductName, 
        @Weight, 
        @Price, 
        @StockQuantity, 
        @IsPerPound, 
        @Category
);