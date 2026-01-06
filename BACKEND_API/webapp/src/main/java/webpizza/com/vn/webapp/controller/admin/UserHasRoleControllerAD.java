package webpizza.com.vn.webapp.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import webpizza.com.vn.webapp.DTO.admin.UserHasRolesDTO_AD.UserHasRolesBatchCreateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.UserHasRolesServiceAD;

@RestController
@RequestMapping("/api/admin/userhasroles")
public class UserHasRoleControllerAD {
    @Autowired
    private UserHasRolesServiceAD userHasRolesServiceAD;

     /**
     * API: Đồng bộ roles của user (Sync)
     * Body: { "userId": 1, "roleIds": [1, 2, 3] }
     * Giải quyết: Nhấn "Lưu" trên giao diện sẽ gọi vào đây.
     */
    @PostMapping("/syncUserHasRoles")
    public ResponseEntity<Map<String, Object>> syncUserHasRoles(@RequestBody UserHasRolesBatchCreateRequestDTO_AD requestDTO) {
        return userHasRolesServiceAD.syncUserHasRoles(requestDTO);
    }

    /**
     * API: Lấy danh sách ID của role theo UserId
     * Giải quyết: Khi chọn user trên Select Box, UI gọi API này để biết
     * roles nào có trong user đó trên csdl sẽ đã được tích (checked) vào ô check bõ
     * trên giao diện UI để người dùng thấy đc.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<List<Integer>> getRolesByUser(@PathVariable Integer userId) {
        return userHasRolesServiceAD.getRoleIdsByUserId(userId);
    }
}
