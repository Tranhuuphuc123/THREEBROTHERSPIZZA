package webpizza.com.vn.webapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Shifts;

@Repository
public interface ShiftRepository extends JpaRepository<Shifts, Integer>{
    /* method xử lý time kiếm cho chức năng tiềm kiếm của salarylevelReposigory */
    @Query("SELECT p FROM Shifts p WHERE "
            + "LOWER(p.shiftName) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
           )
    Page<Shifts> findBySearchContains(@Param("searchTerm") String shiftName,
                                        Pageable pageable);
}
