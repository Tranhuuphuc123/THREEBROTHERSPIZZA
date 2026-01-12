/****************DTO THÓNG KÊ BÁO CÁO************ */
package webpizza.com.vn.webapp.DTO.admin.UserDTO_AD;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserStatisticsDTO_AD {
    // Thống kê giới tính
    private long maleCount;      // gender = 1
    private long femaleCount;     // gender = 0
    
    // Thống kê trạng thái
    private long activeCount;    // isActive = 1
    private long inactiveCount;  // isActive = 0
    
    // Thống kê theo tháng (năm hiện tại)
    private MonthlyStats[] monthlyStats;
    
    // Thống kê theo năm
    private YearlyStats[] yearlyStats;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyStats {
        private int month;
        private long count;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class YearlyStats {
        private int year;
        private long count;
    }
}