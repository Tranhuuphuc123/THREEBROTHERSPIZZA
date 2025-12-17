package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer>,
        PagingAndSortingRepository<Role, Integer> {
}
