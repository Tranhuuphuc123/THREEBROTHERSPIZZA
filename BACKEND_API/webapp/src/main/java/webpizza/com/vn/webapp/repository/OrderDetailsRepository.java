package webpizza.com.vn.webapp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import webpizza.com.vn.webapp.entity.OrderDetail;

public interface OrderDetailsRepository  extends JpaRepository<OrderDetail, Integer>{
    
}
