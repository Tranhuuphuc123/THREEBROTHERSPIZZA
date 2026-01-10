package webpizza.com.vn.webapp.service.auoth;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.DTO.AuthDTO.UserPermissionsResponseDTO;
import webpizza.com.vn.webapp.repository.PermissionRepository;

/****ĐÂY LÀ LỚP LOGIC NGHIỆP VỤ PHÂN QUYỀN CHO USER: sau khi login thành công và đã có token****/
@Service
public class UserPermissionsService {
    @Autowired
    private PermissionRepository permissionRepo;
    
    /* method trả về list các quyền của user */
   public ResponseEntity<Map<String, Object>> getPermission(String username){
        /*1. khởi tạo Map lưu kết quả trả về */
         Map<String, Object> response = new HashMap<>();

        /*2 . Gọi Repository lấy danh sách quyền.
        Lưu ý: Kết quả trả về phải là List<Object[]> vì câu truy vấn (Native Query) 
        trả về nhiều bản ghi (nhiều dòng). Mỗi Object[] đại diện cho 1 dòng dữ liệu.
        -> Object là lớp cha của tất cả các kiểu dữ liệu. Khi bạn viết một câu 
        lệnh SQL SELECT nhiều cột (ví dụ: username, name, display_name), kết quả
        trả về của một dòng không thể khớp hoàn toàn với một kiểu dữ liệu đơn lẻ
        nào (không hẳn là String, cũng không hẳn là Integer).
         + Object[] (Mảng Object): Đại diện cho một dòng (row) duy nhất trong kết
          quả truy vấn.
         + Mỗi phần tử trong mảng tương ứng với một cột bạn đã SELECT:
                ++ obj[0]: Giá trị của cột u.username
                ++ obj[1]: Giá trị của cột p.name
                ++ obj[2]: Giá trị của cột p.display_name

         -> List<Object[]> được hiểu như thế nào?
          + Vì một người dùng có thể có nhiều quyền, câu lệnh SQL sẽ trả về nhiều dòng.
          + List<>: Là một cái "giỏ" chứa nhiều phần tử.
          + List<Object[]>: Là một cái giỏ chứa nhiều dòng dữ liệu, trong đó mỗi dòng 
          là một mảng Object[]. 
        */
        List<Object[]> resultPermissions = permissionRepo.findPermissionsRawByUsername(username);

        /* 3. Chuyển đổi (Mapping) dữ liệu:
        Sử dụng .stream() từ List để duyệt qua từng dòng Object[], 
        sau đó khởi tạo DTO tương ứng cho mỗi dòng đó.
        */
        List<UserPermissionsResponseDTO> listPermissionByUsername =  resultPermissions.stream()
                .map(obj -> new UserPermissionsResponseDTO(
                        (String) obj[0], // username
                        (String) obj[1], // permission name
                        (String) obj[2]  // display name
                ))
                .collect(Collectors.toList());

         /*4. trả về kết quả */
         if(listPermissionByUsername != null || listPermissionByUsername.size() > 0){
                response.put("data", listPermissionByUsername);
                response.put("statuscode", 200);
                response.put("msg", " get permissions for username succeess!");

                return new ResponseEntity<>(response, HttpStatus.OK);
         }else{
                response.put("data", null);
                response.put("statuscode", 404);
                response.put("msg", " No data ");

                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
         }


     }
}

