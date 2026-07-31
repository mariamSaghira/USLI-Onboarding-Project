SELECT 
    e.EmployeeID, 
    e.FirstName, 
    e.LastName, 
    e.Email, 
    r.RoleName
FROM Employees e
JOIN Roles r 
ON e.RoleID = r.RoleID; 