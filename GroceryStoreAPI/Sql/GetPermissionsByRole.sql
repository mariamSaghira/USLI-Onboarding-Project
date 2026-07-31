SELECT
    p.PermissionId,
    p.PermissionName
FROM RolePermissions rp
JOIN Permission p
ON rp.PermissionID = p.PermissionID
WHERE rp.RoleID = @RoleID;