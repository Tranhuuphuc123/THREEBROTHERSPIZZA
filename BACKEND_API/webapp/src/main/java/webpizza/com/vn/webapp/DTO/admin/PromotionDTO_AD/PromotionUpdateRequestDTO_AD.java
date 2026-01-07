package webpizza.com.vn.webapp.DTO.admin.PromotionDTO_AD;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PromotionUpdateRequestDTO_AD {
    @NotBlank(message = "khong duoc de trong")
    private String name;
    
    @NotNull(message = "Giá trị giảm giá không được để trống")
    @Positive(message = "Giá trị giảm giá phải là số dương")
    private Float discount;

    private String description;

    // Chuyển sang boolean để khớp với Entity
    private Integer isActive; 

    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @FutureOrPresent(message = "Ngày kết thúc phải từ ngày hiện tại trở đi")
    private LocalDate endDate;
}
