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
public class PromotionCreateRequestDTO_AD {

    @NotBlank(message = "The name cannot be left blank.")
    private String name;
    
    @NotNull(message = "The discount cannot be left blank.")
    @Positive(message = "The discount must be greater than 0.")
    private Float discount;

    private String description;

    // Chuyển sang boolean để khớp với Entity
    private Integer isActive; 

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future") 
    private LocalDate endDate;
}
