package webpizza.com.vn.webapp.controller.admin;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import webpizza.com.vn.webapp.DTO.admin.RoleHasPermissionsDTO_AD.RoleHasPerBatchCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.RoleHasPermissionsDTO_AD.RoleHasPerCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.RoleHasPermissionsDTO_AD.RoleHasPerUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.RoleHasPermissionsServiceAD;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rolehaspermission")
public class RoleHasPermissionControllerAD {
    @Autowired
    private RoleHasPermissionsServiceAD roleHasPermissionsServiceAD;

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
        return roleHasPermissionsServiceAD.getAllRoleHasPermission(pageNumber, pageSize, sortBy);
    }

    //create permission
    //@CrossOrigin(origins = "${client.url}")  
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody RoleHasPerCreateRequestDTO_AD objCreate){
        try{
            return roleHasPermissionsServiceAD.createRoleHasPermission(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","co loi vui long xem lai huhuhu");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //api create batch userhasroles
   //@CrossOrigin(origins = "${client.url}")  
    @PostMapping("/batch-create")
    public ResponseEntity<Map<String, Object>> batchCreate(@Valid @RequestBody RoleHasPerBatchCreateRequestDTO_AD objCreate){
        try{
            return roleHasPermissionsServiceAD.batchCreateRoleHasPermission(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data",ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","co loi kiem tra lai huhuhu");

            return new ResponseEntity<>(response,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //update pẻmission
   //@CrossOrigin(origins = "${client.url}")  
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable(value = "id") Integer id, @RequestBody RoleHasPerUpdateRequestDTO_AD objUpdate){
        return roleHasPermissionsServiceAD.updateRoleHasPermission(id, objUpdate);
    }

    //delete permission
   //@CrossOrigin(origins = "${client.url}")  
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable(value = "id") Integer id){
        return roleHasPermissionsServiceAD.deleteRoleHasPermission(id);
    }
}
