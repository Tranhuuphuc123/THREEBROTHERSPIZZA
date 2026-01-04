package webpizza.com.vn.webapp.controller.admin;

import webpizza.com.vn.webapp.DTO.admin.PermissionDTO_AD.PermissionGroupedDTO_AD;
import webpizza.com.vn.webapp.service.admin.PermissionServiceAD;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin/permissions")
public class PermissionControllerAD {
    //goi service xu ly nau an
    @Autowired
    private PermissionServiceAD permissionServiceAD;

    //call serive trả về danh sách các quyền theo nhóm module_name của permision trong data
    @GetMapping("/grouped")
    public ResponseEntity<List<PermissionGroupedDTO_AD>> getGrouped() {
        return permissionServiceAD.getPermissionsGrouped();
    }
}
