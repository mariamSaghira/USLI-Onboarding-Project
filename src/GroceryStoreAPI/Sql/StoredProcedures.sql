-- =============================================================
-- Stored procedures for the GroceryStore API.
-- Run this script ONCE against your database to create/update
-- the procedures used by ProductsController.
-- =============================================================

IF OBJECT_ID('dbo.usp_GetProducts', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_GetProducts;
GO
CREATE PROCEDURE dbo.usp_GetProducts
AS
BEGIN
	SET NOCOUNT ON;

	SELECT ProductID,
		   ProductName,
		   Weight,
		   Price,
		   StockQuantity,
		   IsPerPound,
		   Category
	FROM Product;
END
GO

IF OBJECT_ID('dbo.usp_AddProduct', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_AddProduct;
GO
CREATE PROCEDURE dbo.usp_AddProduct
	@ProductName   NVARCHAR(200),
	@Weight        DECIMAL(18, 2),
	@Price         DECIMAL(18, 2),
	@StockQuantity INT,
	@IsPerPound    BIT,
	@Category      NVARCHAR(100)
AS
BEGIN
	SET NOCOUNT ON;

	INSERT INTO Product (ProductName, Weight, Price, StockQuantity, IsPerPound, Category)
	VALUES (@ProductName, @Weight, @Price, @StockQuantity, @IsPerPound, @Category);
END
GO

IF OBJECT_ID('dbo.usp_UpdateProduct', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_UpdateProduct;
GO
CREATE PROCEDURE dbo.usp_UpdateProduct
	@ProductID     INT,
	@ProductName   NVARCHAR(200),
	@Weight        DECIMAL(18, 2),
	@Price         DECIMAL(18, 2),
	@StockQuantity INT,
	@IsPerPound    BIT,
	@Category      NVARCHAR(100)
AS
BEGIN
	-- NOCOUNT intentionally left OFF so ExecuteNonQuery returns the rows affected.
	UPDATE Product
	SET ProductName   = @ProductName,
		Weight        = @Weight,
		Price         = @Price,
		StockQuantity = @StockQuantity,
		IsPerPound    = @IsPerPound,
		Category      = @Category
	WHERE ProductID = @ProductID;
END
GO

IF OBJECT_ID('dbo.usp_DeleteReceiptItems', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_DeleteReceiptItems;
GO
CREATE PROCEDURE dbo.usp_DeleteReceiptItems
	@Id INT
AS
BEGIN
	DELETE FROM ReceiptItems
	WHERE ProductID = @Id;
END
GO

IF OBJECT_ID('dbo.usp_DeleteProduct', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_DeleteProduct;
GO
CREATE PROCEDURE dbo.usp_DeleteProduct
	@Id INT
AS
BEGIN
	-- NOCOUNT intentionally left OFF so ExecuteNonQuery returns the rows affected.
	DELETE FROM Product
	WHERE ProductID = @Id;
END
GO

IF OBJECT_ID('dbo.usp_CheckProductStock', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_CheckProductStock;
GO
CREATE PROCEDURE dbo.usp_CheckProductStock
	@ProductId INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT StockQuantity
	FROM Product WITH (UPDLOCK, ROWLOCK)
	WHERE ProductID = @ProductId;
END
GO

IF OBJECT_ID('dbo.usp_UpdateProductStock', 'P') IS NOT NULL
	DROP PROCEDURE dbo.usp_UpdateProductStock;
GO
CREATE PROCEDURE dbo.usp_UpdateProductStock
	@Quantity  INT,
	@ProductId INT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE Product
	SET StockQuantity = StockQuantity - @Quantity
	WHERE ProductID = @ProductId;
END
GO
