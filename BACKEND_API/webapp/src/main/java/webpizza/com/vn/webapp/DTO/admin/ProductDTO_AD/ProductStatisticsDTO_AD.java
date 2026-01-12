/* dto xử lý thống kê báo cáo cho product manage */
package webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductStatisticsDTO_AD {
    // Thống kê theo trạng thái
    private long activeCount;    // isActive = 1
    private long inactiveCount;  // isActive = 0
    
    // Thống kê theo category
    private List<CategoryStats> categoryStats;
    
    // Thống kê theo khoảng giá
    private List<PriceRangeStats> priceRangeStats;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryStats {
        private String categoryName;
        private long count;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PriceRangeStats {
        private String priceRange;
        private long count;
    }
}