package webpizza.com.vn.webapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {
     /* method xử lý time kiếm cho chức năng tiềm kiếm của SupplierReposigory */
    @Query("SELECT m FROM Material m WHERE "
            + "LOWER(m.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
           )
    Page<Material> findBySearchContains(@Param("searchTerm") String name,
                                        Pageable pageable);
}
