using System.Data;
using Microsoft.Data.SqlClient;
using GroceryStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace GroceryStoreAPI.Controllers;

[Route("api/[controller]")]
[ApiController]

public class ProductsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public ProductsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        List<Product> products = new List<Product>();
        string connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
        using SqlConnection connection = new SqlConnection(connectionString);
        using SqlCommand command = new SqlCommand("usp_GetProducts", connection)
        {
            CommandType = CommandType.StoredProcedure
        };
        await connection.OpenAsync();
        using SqlDataReader reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            products.Add(new Product
            {
                ProductID = reader.GetInt32(0),
                ProductName = reader.GetString(1),
                Weight = Convert.ToDecimal(reader["Weight"]),
                Price = Convert.ToDecimal(reader["Price"]),
                StockQuantity = reader.GetInt32(4),
                IsPerPound = reader.GetBoolean(5),
                Category = reader.IsDBNull(6) ? string.Empty : reader.GetString(6)
            });
        }
        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> AddProduct([FromBody] Product product)
    {
        string connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
        using var connection = new SqlConnection(connectionString);

        using var command = new SqlCommand("usp_AddProduct", connection)
        {
            CommandType = CommandType.StoredProcedure
        };
        command.Parameters.AddWithValue("@ProductName", product.ProductName);
        command.Parameters.AddWithValue("@Weight", product.Weight);
        command.Parameters.AddWithValue("@Price", product.Price);
        command.Parameters.AddWithValue("@StockQuantity", product.StockQuantity);
        command.Parameters.AddWithValue("@IsPerPound", product.IsPerPound);
        command.Parameters.AddWithValue("@Category", product.Category);

        await connection.OpenAsync();
        await command.ExecuteNonQueryAsync();

        return Ok(new
        {
            MessageProcessingHandler = "Product added successfully."
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
    {
        string connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
        using var connection = new SqlConnection(connectionString);

        using SqlCommand command = new SqlCommand("usp_UpdateProduct", connection)
        {
            CommandType = CommandType.StoredProcedure
        };


        command.Parameters.AddWithValue("@ProductID", id);
        command.Parameters.AddWithValue("@ProductName", product.ProductName);
        command.Parameters.AddWithValue("@Weight", product.Weight);
        command.Parameters.AddWithValue("@Price", product.Price);
        command.Parameters.AddWithValue("@StockQuantity", product.StockQuantity);
        command.Parameters.AddWithValue("@IsPerPound", product.IsPerPound);
        command.Parameters.AddWithValue("@Category", product.Category);

        await connection.OpenAsync();
        int rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0) return NotFound("Product not found.");
        return Ok(new
        {
            message = "Product information updated successfully"
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        string? connectionString = _configuration.GetConnectionString("DefaultConnection");

        using var connection = new SqlConnection(connectionString);
        await connection.OpenAsync();

        using var transaction = connection.BeginTransaction();

        try
        {
            using (var receiptItemsCommand =
               new SqlCommand("usp_DeleteReceiptItems", connection, transaction)
               {
                   CommandType = CommandType.StoredProcedure
               })
            {
                receiptItemsCommand.Parameters.AddWithValue("@Id", id);
                await receiptItemsCommand.ExecuteNonQueryAsync();
            }

            using var productCommand =
                new SqlCommand("usp_DeleteProduct", connection, transaction)
                {
                    CommandType = CommandType.StoredProcedure
                };

            productCommand.Parameters.AddWithValue("@Id", id);

            int rowsAffected = await productCommand.ExecuteNonQueryAsync();

            if (rowsAffected == 0)
            {
                transaction.Rollback();
                return NotFound("Product was not found");
            }

            transaction.Commit();
            return Ok(new
            {
                message = "Product deleted successfully."
             });
        }

        catch
        {
            transaction.Rollback();
            throw;
        }
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout([FromBody] CheckoutRequest request)
    {
        //Validate Request
        if (request.Items == null || !request.Items.Any())
        {
            return BadRequest("Cart is empty.");
        }

        using SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

        connection.Open();

        using SqlTransaction transaction = connection.BeginTransaction();

        try
        {
            foreach (CheckoutItem item in request.Items)
            {
                //check the current quantity while locking the row
                using SqlCommand checkCommand = new SqlCommand("usp_CheckProductStock", connection, transaction)
                {
                    CommandType = CommandType.StoredProcedure
                };

                checkCommand.Parameters.AddWithValue("@ProductId", item.ProductId);

                object? result = checkCommand.ExecuteScalar();

                if (result == null)
                {
                    transaction.Rollback();
                    return NotFound($"Product {item.ProductId} was not found.");
                }

                int availableQuantity = Convert.ToInt32(result);

                if (item.Quantity <= 0)
                {
                    transaction.Rollback();
                    return BadRequest("Item quantity must be greater than sero.");
                }

                if (availableQuantity < item.Quantity)
                {
                    transaction.Rollback();

                    return BadRequest(
                        $"Not enough inventory for product {item.ProductId}. " + $"Only {availableQuantity} remaining."
                    );
                }

                using SqlCommand updateCommand = new SqlCommand("usp_UpdateProductStock", connection, transaction)
                {
                    CommandType = CommandType.StoredProcedure
                };

                updateCommand.Parameters.AddWithValue("@Quantity", item.Quantity);
                updateCommand.Parameters.AddWithValue("@ProductId", item.ProductId);

                updateCommand.ExecuteNonQuery();
            }

            transaction.Commit();
            return Ok(new
            {
                message = "Transaction completed successfully."
            });
        }
        catch (Exception ex)
        {
            transaction.Rollback();

            return StatusCode(500, new
            {
                message = "Checkout failed. No inventory was changed.",
                error = ex.Message
            });
        }
    }
}
