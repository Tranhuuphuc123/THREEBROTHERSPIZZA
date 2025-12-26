package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Supplier;

@Repository
public interface SupplierRepository extends CrudRepository<Supplier, Integer>, 
                            PagingAndSortingRepository<Supplier, Integer> {
    
}