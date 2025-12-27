package webpizza.com.vn.webapp.controller.Auth;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import webpizza.com.vn.webapp.service.auoth.UserPermissionsService;

/*xác thực phân quyền: phần này là controller cho Authorization lấy permision cho user
để phân quyền user đó có quyền gì đc thực hiện call api cho chức năng gì trong quyền
hạn của user đó*/
@RestController
@RequestMapping("/api/authorization")
public class AuthGetPermissionsController {

    @Autowired
    private UserPermissionsService userPerService;
    

    @PostMapping("/getListPermissionsByUsername")
    public ResponseEntity<Map<String, Object>> getPermissions(@RequestParam String username ){
        //1. nhờ service thực hiện trả về ds quyền cho user 
        return userPerService.getPermission(username);
    }
}
