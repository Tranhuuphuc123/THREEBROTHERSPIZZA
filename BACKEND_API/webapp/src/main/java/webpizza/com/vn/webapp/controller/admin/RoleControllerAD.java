package webpizza.com.vn.webapp.controller.admin;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import webpizza.com.vn.webapp.DTO.admin.RoleDTO_AD.RoleCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.RoleDTO_AD.RoleUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.RoleServiceAD;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/roles")
public class RoleControllerAD {
    @Autowired
    private RoleServiceAD roleServiceAD;


    //get value khong phân trang
    @GetMapping("/listRoles")
    public ResponseEntity<Map<String, Object>> getAlls(){
       //gọi đến service thực hiện truy vấn CRUD - cụ thể là getAll dữ liệu mà mình viết logic bên đó
		return  roleServiceAD.getRoles();
    }


    //getall
     /*  
     -> @CrossOrigin(origins = "${client.url}") : cho phép localhost 8080 chấp nhận
    chay localhost 3000 khi localhost 8080 đang chay
     -> ${client.url}: thì trong application.properties mình đã cấu hình là 
     client.url = "http://localhost:3000" nên ở đây chỉ cần lôi key là đc quản lý 
     cấu hình tập trung
    * */
    //@CrossOrigin(origins = "${client.url}") 
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                      @RequestParam(defaultValue = "3") Integer pageSize,
                                                      @RequestParam(defaultValue = "id") String sortBy){
        // goi service thuc hien truy van hien thi tat ca thong tin cua table user co phan trang
        return roleServiceAD.getRolesPagination(pageNumber, pageSize, sortBy);
    }

    //create permission
     //@CrossOrigin(origins = "${client.url}") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody RoleCreateRequestDTO_AD objCreate){
        try{
            return roleServiceAD.createRole(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","co loi vui long xem lai huhuhu");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //update pẻmission
     //@CrossOrigin(origins = "${client.url}") 
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable(value = "id") Integer id, @RequestBody RoleUpdateRequestDTO_AD objUpdate){
        return roleServiceAD.updateRole(id, objUpdate);
    }

    //delete permission
    //@CrossOrigin(origins = "${client.url}") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable(value = "id") Integer id){
        return roleServiceAD.deleteRole(id);
    }
}
