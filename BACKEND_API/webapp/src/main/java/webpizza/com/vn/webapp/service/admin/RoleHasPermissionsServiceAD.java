package webpizza.com.vn.webapp.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import webpizza.com.vn.webapp.DTO.admin.RoleHasPermissionsDTO_AD.RoleHasPerBatchCreateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Permission;
import webpizza.com.vn.webapp.entity.Role;
import webpizza.com.vn.webapp.entity.RoleHasPermissions;
import webpizza.com.vn.webapp.repository.PermissionRepository;
import webpizza.com.vn.webapp.repository.RoleHasPermissionRepository;
import webpizza.com.vn.webapp.repository.RoleRepository;

import java.util.*;

@Service
public class RoleHasPermissionsServiceAD {

    @Autowired
    private RoleHasPermissionRepository roleHasPermissionRepo;

    @Autowired
    private RoleRepository roleRepo;

    @Autowired
    private PermissionRepository permissionRepo;
   
    /* method xử lý cấp quyền khong phân cấp 
     => Hàm này sẽ dọn dẹp cái cũ và nạp cái mới. 
     => giao diện dạng Checkbox như vậy, người dùng mong muốn chỉ cần
      "Tích/Bỏ tích rồi ấn Lưu" là xong, chứ không muốn quan tâm hệ thống
       đang gọi API Create hay Delete. Để giải quyết vấn đề "Update và Create
       trong một button", phương pháp tối ưu nhất ở Backend là chiến lược "Sync" 
       (Đồng bộ) thay vì tách rời Create/Update/Delete.


      ====Thay vì viết hàm batchCreate, bạn hãy viết một hàm syncRolePermissions+=====
      =>  Quy trình xử lý như sau:
        + Nhận vào roleId và danh sách permissionIds mới nhất từ giao diện.
        + Xóa tất cả các quyền cũ của roleId đó trong bảng trung gian.
        + Thêm mới lại toàn bộ danh sách quyền vừa nhận được.
    
      =>  Tại sao làm cách này?
        + Tránh việc phải so sánh cái nào có rồi thì giữ, cái nào chưa có thì thêm, 
        cái nào thừa thì xóa (rất phức tạp và dễ lỗi logic).
        + Đảm bảo dữ liệu trong DB luôn khớp 100% với những gì người dùng nhìn thấy
         trên màn hình khi ấn nút "Lưu". 
    */
    @Transactional // Đảm bảo nếu lưu lỗi thì không bị xóa mất dữ liệu cũ
    public ResponseEntity<Map<String, Object>> syncRolePermissions(RoleHasPerBatchCreateRequestDTO_AD obj) {
        Map<String, Object> response = new HashMap<>();

        // 1. Xóa toàn bộ quyền cũ của Role này
        roleHasPermissionRepo.deleteByRoleId(obj.getRoleId());

        // 2. Nếu danh sách permissionId gửi lên không rỗng, tiến hành lưu mới
        List<RoleHasPermissions> savedEntities = new ArrayList<>();
        if (obj.getPermissionId() != null && !obj.getPermissionId().isEmpty()) {
            Role role = roleRepo.findById(obj.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role không tồn tại"));

            for (Integer pId : obj.getPermissionId()) {
                Permission permission = permissionRepo.findById(pId)
                        .orElseThrow(() -> new RuntimeException("Permission ID " + pId + " không tồn tại"));

                RoleHasPermissions newRel = new RoleHasPermissions();
                newRel.setRole(role);
                newRel.setPermission(permission);
                savedEntities.add(newRel);
            }
            roleHasPermissionRepo.saveAll(savedEntities);
        }

        response.put("statuscode", 200);
        response.put("msg", "Đã cập nhật phân quyền thành công!");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    /**Lấy danh sách ID các permission của một Role (Dùng để hiển thị checkbox trên UI)**/
    public ResponseEntity<List<Integer>> getPermissionIdsByRoleId(Integer roleId) {
        List<RoleHasPermissions> list = roleHasPermissionRepo.findByRoleId(roleId);
        
        // Chuyển đổi từ danh sách Entity sang danh sách ID nguyên bản
        List<Integer> permissionIds = list.stream()
                .map(item -> item.getPermission().getId())
                .toList();
                
        return new ResponseEntity<>(permissionIds, HttpStatus.OK);
    }

}
