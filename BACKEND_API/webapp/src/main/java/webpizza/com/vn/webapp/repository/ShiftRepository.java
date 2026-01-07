package webpizza.com.vn.webapp.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import webpizza.com.vn.webapp.entity.Shifts;

@Repository
public interface ShiftRepository extends CrudRepository<Shifts, Integer>,
        PagingAndSortingRepository<Shifts, Integer> {
}
