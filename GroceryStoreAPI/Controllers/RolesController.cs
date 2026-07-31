using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;

namespace GroceryStoreAPI.Controllers;
[Route("api/[controller]")]
[ApiController]
public class RolesController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public RolesController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        List<object> roles = new List<object>();
        string connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");
        using SqlConnection connection = new SqlConnection(connectionString);
        string query = "SELECT RoleID, RoleName FROM Roles";
        using SqlCommand command = new SqlCommand(query, connection);
        await connection.OpenAsync();
        using SqlDataReader reader = await command.ExecuteReaderAsync();
        while (await reader.ReadAsync())
        {
            roles.Add(new
            {
                RoleID = reader.GetInt32(0),
                RoleName = reader.GetString(1)
            });
        }
        return Ok(roles);
    }

    [HttpGet("{roleId}/permissions")]
    public async Task<IActionResult> GetPermissionsByRole(int roleId)
    {
        List<object> permission = new List<object>();

        string connectionString = _configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string not found");

        using SqlConnection connection = new SqlConnection(connectionString);

        string query = await System.IO.File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Sql", "GetPermissionsByRole"));

        using SqlCommand command = new SqlCommand(query, connection);

        command.Parameters.AddWithValue("@RoleID", roleId);

        await connection.OpenAsync();

        using SqlDataReader reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            permission.Add(new
            {
                PermissionID = reader.GetInt32(0),
                PermissionName = reader.GetString(1)
            });
        }
        return Ok(permission);
    }
}
