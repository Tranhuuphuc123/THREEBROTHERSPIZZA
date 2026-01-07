package webpizza.com.vn.webapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{

    // Code hiện tại máy bạn (Ví dụ: hàm phân trang cũ)
    Page<Product> findAll(Pageable pageable);

   /** Tự động sinh query: SELECT * FROM products WHERE product_type = ? 
    * phục vụ chức năng đổ value lên giao diện homepage ở product card 
    * và đẩy value vào các trang product, product detail
    * **/
    //List<Product> findByProductType(String productType, Integer isActive);

}