package webpizza.com.vn.webapp.controller.client;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import webpizza.com.vn.webapp.DTO.client.RoleHasPermissionsDTO_CL.RoleHasPerCreateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.RoleHasPermissionsDTO_CL.RoleHasPerUpdateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserHasRolesDTO_CL.UserHasRoleCreateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserHasRolesDTO_CL.UserHasRoleUpdateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserHasRolesDTO_CL.UserHasRolesBatchCreateRequestDTO_CL;
import webpizza.com.vn.webapp.service.client.UserHasRolesServiceCL;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/client/userhasrole")
public class UserHasRoleControllerCL {
    @Autowired
    private UserHasRolesServiceCL userHasRolesServiceCL;


    //getall
    /*  @CrossOrigin(origins = "http://localhost:3000": cho phép localhost 8080 chấp nhận
    chay localhost 3000 khi localhost 8080 đang chay
    * */
    @CrossOrigin(origins = "http://localhost:3000") 
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                      @RequestParam(defaultValue = "3") Integer pageSize,
                                                      @RequestParam(defaultValue = "id") String sortBy){
        // goi service thuc hien truy van hien thi tat ca thong tin cua table user co phan trang
        return userHasRolesServiceCL.getAllUserHasRole(pageNumber, pageSize, sortBy);
    }



    //create permission
    @CrossOrigin(origins = "http://localhost:3000") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody UserHasRoleCreateRequestDTO_CL objCreate){
        try{
            return userHasRolesServiceCL.createUserHasRole(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","co loi vui long xem lai huhuhu");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //api create batch userhasroles
    @CrossOrigin(origins = "http://localhost:3000") 
    @PostMapping("/batch-create")
    public ResponseEntity<Map<String, Object>> batchCreate(@Valid @RequestBody UserHasRolesBatchCreateRequestDTO_CL objCreate){
        try{
            return userHasRolesServiceCL.batchCreateUserHasRoles(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","ngu nhu cho nhap sai nhap lai may dam may gio");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //update pẻmission
    @CrossOrigin(origins = "http://localhost:3000") 
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable(value = "id") Integer id, @RequestBody UserHasRoleUpdateRequestDTO_CL objUpdate){
        return userHasRolesServiceCL.updateUserHasRole(id, objUpdate);
    }

    //delete permission
    @CrossOrigin(origins = "http://localhost:3000") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable(value = "id") Integer id){
        return userHasRolesServiceCL.deleteUserHasRole(id);
    }
}
