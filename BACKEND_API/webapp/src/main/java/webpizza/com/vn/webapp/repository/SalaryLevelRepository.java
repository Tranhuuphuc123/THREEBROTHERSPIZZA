package webpizza.com.vn.webapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.SalaryLevels;

@Repository
public interface SalaryLevelRepository extends JpaRepository<SalaryLevels, Integer>{
    /* method xử lý time kiếm cho chức năng tiềm kiếm của salarylevelReposigory */
    @Query("SELECT p FROM SalaryLevels p WHERE "
            + "LOWER(p.levelName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
           )
    Page<SalaryLevels> findBySearchContains(@Param("searchTerm") String levelName,
                                        Pageable pageable);
}