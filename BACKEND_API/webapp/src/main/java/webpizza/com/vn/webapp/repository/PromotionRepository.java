package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Promotion;

@Repository
public interface PromotionRepository extends CrudRepository<Promotion, Integer>,
                                            PagingAndSortingRepository<Promotion, Integer> {

    
} 