package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.SalaryLevels;

@Repository
public interface SalaryLevelRepository extends CrudRepository<SalaryLevels, Integer>,
        PagingAndSortingRepository<SalaryLevels, Integer> {
}
