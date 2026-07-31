UPDATE Employees
            SET
                FirstName = @FirstName,
                LastName = @LastName,
                ManagerID = @ManagerID,
                Email = @Email,
                RoleID = @RoleID
            WHERE EmployeeID = @EmployeeID;