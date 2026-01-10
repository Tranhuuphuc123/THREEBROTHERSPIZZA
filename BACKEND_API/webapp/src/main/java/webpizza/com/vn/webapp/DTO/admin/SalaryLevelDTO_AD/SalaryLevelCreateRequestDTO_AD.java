package webpizza.com.vn.webapp.DTO.admin.SalaryLevelDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryLevelCreateRequestDTO_AD {
    @NotBlank(message = "LevelName cannot empty")
    private String levelName;

    @NotNull(message = "hourlyWage cannot empty")
    private Float hourlyWage;

    @NotBlank(message = "description cannot empty")
    private String description;
}
