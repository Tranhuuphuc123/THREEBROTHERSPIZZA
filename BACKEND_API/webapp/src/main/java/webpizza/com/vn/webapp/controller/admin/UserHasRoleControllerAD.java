package webpizza.com.vn.webapp.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import webpizza.com.vn.webapp.service.admin.UserHasRolesServiceAD;

@RestController
@RequestMapping("/api/admin/userhasrole")
public class UserHasRoleControllerAD {
    @Autowired
    private UserHasRolesServiceAD userHasRolesServiceAD;

}
