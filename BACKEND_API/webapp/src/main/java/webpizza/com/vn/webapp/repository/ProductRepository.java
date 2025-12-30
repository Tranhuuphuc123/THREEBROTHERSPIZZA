package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Product;

@Repository
public interface ProductRepository extends CrudRepository<Product, Integer>,
                                            PagingAndSortingRepository<Product, Integer> {

    
} 