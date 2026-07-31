UPDATE Employees
            SET IsActive = 0, DeactivateAt = @DeactivateAt
            WHERE EmployeeID = @Id;