package webpizza.com.vn.webapp.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Feedbacks;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedbacks, Integer>{
    /* method xử lý time kiếm cho chức năng tiềm kiếm của SupplierReposigory */
    @Query("SELECT p FROM Feedbacks p WHERE "
            + "p.productId = :searchTerm OR "
            + "p.userId = :searchTerm"
           )
    Page<Feedbacks> findBySearchContains(@Param("searchTerm") Number productId,
                                        @Param("searchTerm") Number userId,
                                        Pageable pageable);
}