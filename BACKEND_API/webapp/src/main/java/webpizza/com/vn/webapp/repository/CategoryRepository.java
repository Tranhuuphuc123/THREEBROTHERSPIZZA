package webpizza.com.vn.webapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    /* method xử lý time kiếm cho chức năng tiềm kiếm của CategoryRepository */
    @Query("SELECT p FROM Category p WHERE "
            + "LOWER(p.code) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR "
            + "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
           )
    Page<Category> findBySearchContains(@Param("searchTerm") String code,
                                        @Param("searchTerm") String name,
                                        Pageable pageable);
} 