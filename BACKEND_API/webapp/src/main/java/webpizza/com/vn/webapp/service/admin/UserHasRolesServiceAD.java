package webpizza.com.vn.webapp.service.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import webpizza.com.vn.webapp.DTO.admin.UserHasRolesDTO_AD.UserHasRolesBatchCreateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Role;
import webpizza.com.vn.webapp.entity.User;
import webpizza.com.vn.webapp.entity.UserHasRoles;
import webpizza.com.vn.webapp.repository.RoleRepository;
import webpizza.com.vn.webapp.repository.UserHasRolesRepository;
import webpizza.com.vn.webapp.repository.UserRepository;


@Service
public class UserHasRolesServiceAD {
    @Autowired
    private UserHasRolesRepository userHasRolesRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private RoleRepository roleRepo;

     /* method xử lý cấp role cho user không phân cấp api tách biệt
     => Hàm này sẽ dọn dẹp cái cũ và nạp cái mới. 
     => giao diện dạng Checkbox như vậy, người dùng mong muốn chỉ cần
      "Tích/Bỏ tích rồi ấn Lưu" là xong, chứ không muốn quan tâm hệ thống
       đang gọi API Create hay Delete. Để giải quyết vấn đề "Update và Create
       trong một button", phương pháp tối ưu nhất ở Backend là chiến lược "Sync" 
       (Đồng bộ) thay vì tách rời Create/Update/Delete.


      ====Thay vì viết hàm batchCreate, bạn hãy viết một hàm syncRolePermissions+=====
      =>  Quy trình xử lý như sau:
        + Nhận vào userId và danh sách roleIds mới nhất từ giao diện.
        + Xóa tất cả các roles cũ của userId đó trong bảng trung gian.
        + Thêm mới lại toàn bộ danh sách quyền vừa nhận được.
    
      =>  Tại sao làm cách này?
        + Tránh việc phải so sánh cái nào có rồi thì giữ, cái nào chưa có thì thêm, 
        cái nào thừa thì xóa (rất phức tạp và dễ lỗi logic).
        + Đảm bảo dữ liệu trong DB luôn khớp 100% với những gì người dùng nhìn thấy
         trên màn hình khi ấn nút "Lưu". 
    */
    @Transactional // Đảm bảo nếu lưu lỗi thì không bị xóa mất dữ liệu cũ
    public ResponseEntity<Map<String, Object>> syncUserHasRoles(UserHasRolesBatchCreateRequestDTO_AD obj) {
        Map<String, Object> response = new HashMap<>();

        // 1. Xóa toàn bộ roles cũ của User này
        userHasRolesRepo.deleteByUserId(obj.getUserId());

        // 2. Nếu danh sách permissionId gửi lên không rỗng, tiến hành lưu mới
        List<UserHasRoles> savedEntities = new ArrayList<>();
        if (obj.getRoleIds() != null && !obj.getRoleIds().isEmpty()) {
            User user = userRepo.findById(obj.getUserId())
                    .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            for (Integer rId : obj.getRoleIds()) {
                Role role = roleRepo.findById(rId)
                        .orElseThrow(() -> new RuntimeException("RoleId " + rId + " không tồn tại"));

                UserHasRoles newRel = new UserHasRoles();
                newRel.setUser(user);
                newRel.setRole(role);
                savedEntities.add(newRel);
            }
            userHasRolesRepo.saveAll(savedEntities);
        }

        response.put("statuscode", 200);
        response.put("msg", "Đã cập nhật phân vai trò thành công cho user!");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    /**Lấy danh sách ID các role của một User (Dùng để hiển thị checkbox trên UI)**/
    public ResponseEntity<List<Integer>> getRoleIdsByUserId(Integer userId) {
        List<UserHasRoles> list = userHasRolesRepo.findByUserId(userId);
        
        // Chuyển đổi từ danh sách Entity sang danh sách ID nguyên bản
        List<Integer> roleIds = list.stream()
                .map(item -> item.getRole().getId())
                .toList();
                
        return new ResponseEntity<>(roleIds, HttpStatus.OK);
    }


}
