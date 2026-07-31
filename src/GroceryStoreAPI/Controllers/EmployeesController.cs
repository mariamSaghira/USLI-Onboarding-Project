using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using GroceryStoreAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

namespace GroceryStoreAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public EmployeesController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees()
    {
        List<object> employees = new List<object>();
        string connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
        using SqlConnection connection = new SqlConnection(connectionString);
        string query = await System.IO.File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Sql", "GetEmployees"));
            
        using SqlCommand command = new SqlCommand(query, connection);
        await connection.OpenAsync();
        using SqlDataReader reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            employees.Add(new
            {
                EmployeeID = reader.GetInt32(0),
                FirstName = reader.GetString(1),
                LastName = reader.GetString(2),
                Email = reader.GetString(3),
                RoleName = reader.GetString(4)
            });
        }
        return Ok(employees);
    }

    [HttpPost]
    public async Task<IActionResult> AddEmployee([FromBody] Employee employee)
    {
        string? connectionString = _configuration.GetConnectionString("DefaultConnection");

        using SqlConnection connection = new SqlConnection(connectionString);

        string query = await System.IO.File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Sql", "AddEmployee"));

        using SqlCommand command = new SqlCommand(query, connection);

        command.Parameters.AddWithValue("@EmployeeID", employee.EmployeeID);
        command.Parameters.AddWithValue("@FirstName", employee.FirstName);
        command.Parameters.AddWithValue("@LastName", employee.LastName);
        command.Parameters.AddWithValue("@ManagerID", employee.ManagerID);
        command.Parameters.AddWithValue("@Email", employee.Email);
        command.Parameters.AddWithValue("@RoleID", employee.RoleID);

        await connection.OpenAsync(); 
        await command.ExecuteNonQueryAsync();

        return Ok("Employee added successfully.");
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
    {
        string? connectionString = _configuration.GetConnectionString("DefaultConnection");

        using SqlConnection connection = new SqlConnection(connectionString);

        string query = await System.IO.File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Sql", "UpdateEmployee"));

        using SqlCommand command = new SqlCommand(query, connection);


        command.Parameters.AddWithValue("@EmployeeID", id);
        command.Parameters.AddWithValue("@FirstName", employee.FirstName);
        command.Parameters.AddWithValue("@LastName", employee.LastName);
        command.Parameters.AddWithValue("@ManagerID", employee.ManagerID);
        command.Parameters.AddWithValue("@Email", employee.Email);
        command.Parameters.AddWithValue("@RoleID", employee.RoleID);

        await connection.OpenAsync();
        int rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0) return NotFound("Employee not found.");
        return Ok("Employee information updated successfully");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        string? connectionString = _configuration.GetConnectionString("DefaultConnection");

        string query = await System.IO.File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Sql", "DeleteEmployee"));

        using var connection = new SqlConnection(connectionString);
        using var command = new SqlCommand(query, connection);
        command.Parameters.AddWithValue("@Id", id); 
        command.Parameters.AddWithValue("@DeactivateAt", DateTime.Now);

        await connection.OpenAsync();
        int rowsAffected = await command.ExecuteNonQueryAsync();

        if (rowsAffected == 0)
        {
            return NotFound("Employee not found.");
        }
        return Ok("Employee deactivated successfully.");
    }
}
