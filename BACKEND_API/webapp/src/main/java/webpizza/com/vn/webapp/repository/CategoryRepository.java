package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Category;

@Repository
public interface CategoryRepository extends CrudRepository<Category, Integer>,
                                            PagingAndSortingRepository<Category, Integer> {

    
} 