package webpizza.com.vn.webapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Promotion;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {

    /**xay dung method tu viet api spring boot tiem kiem theo ten va co phan trang
     * => phục vụ tính năng chức năng search á**/
    @Query("SELECT p FROM Promotion p WHERE "
            + "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Promotion> findBySearchContains( @Param("searchTerm") String promotionName,
                                          Pageable pageable);

} 