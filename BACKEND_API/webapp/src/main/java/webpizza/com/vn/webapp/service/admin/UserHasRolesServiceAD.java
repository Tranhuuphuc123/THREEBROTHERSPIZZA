package webpizza.com.vn.webapp.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

}
