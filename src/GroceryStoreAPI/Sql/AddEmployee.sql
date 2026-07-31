INSERT INTO Employees (
    EmployeeID, 
    FirstName, 
    LastName,
    ManagerID, 
    Email, 
    RoleID
)
VALUES (
    @EmployeeID, 
    @FirstName, 
    @LastName, 
    @ManagerID, 
    @Email, 
    @RoleID
)