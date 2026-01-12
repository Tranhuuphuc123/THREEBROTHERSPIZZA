package webpizza.com.vn.webapp.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{

    // Code hiện tại máy bạn (Ví dụ: hàm phân trang cũ)
    Page<Product> findAll(Pageable pageable);

   /** Query rõ ràng: SELECT * FROM products WHERE product_type = ? AND is_active = ?
    * phục vụ chức năng đổ value lên giao diện homepage ở product card 
    * và đẩy value vào các trang product, product detail
    * dựa trên tiêu chí là producttype của bảng product và 
    * trạng thái để lọc hiển thị các product theo hạng mục 
    * danh sách loại...
    * **/
    @Query("SELECT p FROM Product p WHERE p.productType = :productType AND p.isActive = :isActive")
    List<Product> findByProductTypeAndIsActive(
        @Param("productType") String productType, 
        @Param("isActive") Integer isActive
    );

    /** Query để lấy tất cả sản phẩm có productType bắt đầu bằng pattern (ví dụ: "pizza%")
     *  Phục vụ chức năng lấy tất cả các loại pizza khi vào trang product từ homepage
     * ý là product trong csdl có mục product type nhưng vd cùng là pizza lại có nhiều 
     * tên khác nhau: pizza seafood, pizza vegetabrian... mà mình muốn đổ các bánh pizza 
     * thì koong đc do type tuy có chữa pizza nhưng phía hậu tố có thêm tên nên cần thêm query 
     * này đẻ hiện thì các bánh có productype là pizza ở tiền tố tên
     * */
    @Query("SELECT p FROM Product p WHERE p.productType LIKE :productTypePattern AND p.isActive = :isActive")
    List<Product> findByProductTypePatternAndIsActive(
        @Param("productTypePattern") String productTypePattern, 
        @Param("isActive") Integer isActive
    );


    /*Spring sẽ tự tạo câu query: SELECT COUNT(*) FROM products WHERE category_id = ?
    => nó phục vụ cho chức năng delete của category vì category là khóa ngoại trong 
    product khi xóa category thì phải kiểm tra xem khóa ngoại này thì product có đang dùng 
    không nếu có thì phải seelect count coi product ở categoryid đó có đg chọn không để 
    loại trừ hay thông báo để biết mà không xóa category id đó đi khi nó đg đc product chọn
    dùng  
    */
    long countByCategoryId(Integer categoryId);



    /***********method xử lý thống kế báo cáo cho product************* */
    // Thống kê theo trạng thái active
    @Query("SELECT COUNT(p) FROM Product p WHERE p.isActive = :isActive")
    long countByIsActive(@Param("isActive") Integer isActive);
    
    // Thống kê theo category (join với Category để lấy tên)
    @Query("SELECT c.name, COUNT(p) as count " +
           "FROM Product p " +
           "JOIN Category c ON p.categoryId = c.id " +
           "GROUP BY c.id, c.name " +
           "ORDER BY count DESC")
    List<Object[]> countProductsByCategory();
    
    // Thống kê theo khoảng giá
    @Query("SELECT " +
           "CASE " +
           "  WHEN p.price < 100000 THEN 'Under 100k' " +
           "  WHEN p.price >= 100000 AND p.price < 200000 THEN '100k - 200k' " +
           "  WHEN p.price >= 200000 AND p.price < 300000 THEN '200k - 300k' " +
           "  WHEN p.price >= 300000 AND p.price < 500000 THEN '300k - 500k' " +
           "  ELSE 'Over 500k' " +
           "END as priceRange, " +
           "COUNT(p) as count " +
           "FROM Product p " +
           "GROUP BY priceRange " +
           "ORDER BY MIN(p.price)")
    List<Object[]> countProductsByPriceRange();

}

