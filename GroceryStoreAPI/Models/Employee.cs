namespace GroceryStoreAPI.Models
{
    // Employee data
    public class Employee
    {
        public int EmployeeID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public int? ManagerID { get; set; }
        public string Email { get; set; } = string.Empty;
        public int? RoleID { get; set; }
    }
}

