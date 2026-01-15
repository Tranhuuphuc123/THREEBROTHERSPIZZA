package webpizza.com.vn.webapp.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import webpizza.com.vn.webapp.entity.Order;
import webpizza.com.vn.webapp.entity.User;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByCustomerId(User customerId);
}
