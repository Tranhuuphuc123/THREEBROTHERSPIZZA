package webpizza.com.vn.webapp.DTO.admin.SalaryLevelDTO_AD;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryLevelUpdateRequestDTO_AD {
    @NotBlank(message = "ai cho may de trong")
    private String levelName;

    @NotBlank(message = "ai cho may de trong")
    private Float hourlyWage;

    @NotBlank(message = "ai cho may de trong")
    private String description;


}
