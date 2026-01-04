package webpizza.com.vn.webapp.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import webpizza.com.vn.webapp.DTO.admin.RoleHasPermissionsDTO_AD.RoleHasPerBatchCreateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.RoleHasPermissionsServiceAD;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rolehaspermissions")
public class RoleHasPermissionControllerAD {

    @Autowired
    private RoleHasPermissionsServiceAD roleHasPermissionsServiceAD;

    /**
     * API: Đồng bộ quyền (Sync)
     * Body: { "roleId": 1, "permissionId": [101, 102, 201] }
     * Giải quyết: Nhấn "Lưu" trên giao diện sẽ gọi vào đây.
     */
    @PostMapping("/syncPermissions")
    public ResponseEntity<Map<String, Object>> syncPermissions(@RequestBody RoleHasPerBatchCreateRequestDTO_AD requestDTO) {
        return roleHasPermissionsServiceAD.syncRolePermissions(requestDTO);
    }

    /**
     * API: Lấy danh sách ID quyền theo RoleId
     * Giải quyết: Khi chọn Role trên Select Box, UI gọi API này để biết ô nào đã được tích (checked)
     * trc đó.
     */
    @GetMapping("/{roleId}")
    public ResponseEntity<List<Integer>> getPermissionsByRole(@PathVariable Integer roleId) {
        return roleHasPermissionsServiceAD.getPermissionIdsByRoleId(roleId);
    }
}