package webpizza.com.vn.webapp.controller.admin;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import webpizza.com.vn.webapp.DTO.admin.UserHasRolesDTO_AD.UserHasRoleCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.UserHasRolesDTO_AD.UserHasRoleUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.UserHasRolesDTO_AD.UserHasRolesBatchCreateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.UserHasRolesServiceAD;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/userhasrole")
public class UserHasRoleControllerAD {
    @Autowired
    private UserHasRolesServiceAD userHasRolesServiceAD;


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
        return userHasRolesServiceAD.getAllUserHasRole(pageNumber, pageSize, sortBy);
    }



    //create permission
   //@CrossOrigin(origins = "${client.url}") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody UserHasRoleCreateRequestDTO_AD objCreate){
        try{
            return userHasRolesServiceAD.createUserHasRole(objCreate);
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
    public ResponseEntity<Map<String, Object>> batchCreate(@Valid @RequestBody UserHasRolesBatchCreateRequestDTO_AD objCreate){
        try{
            return userHasRolesServiceAD.batchCreateUserHasRoles(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","ngu nhu cho nhap sai nhap lai may dam may gio");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //update pẻmission
    // @CrossOrigin(origins = "http://localhost:3000") 
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable(value = "id") Integer id, @RequestBody UserHasRoleUpdateRequestDTO_AD objUpdate){
        return userHasRolesServiceAD.updateUserHasRole(id, objUpdate);
    }

    //delete permission
    // @CrossOrigin(origins = "http://localhost:3000") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable(value = "id") Integer id){
        return userHasRolesServiceAD.deleteUserHasRole(id);
    }
}
