package webpizza.com.vn.webapp.DTO.admin.SalaryLevelDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalaryLevelUpdateRequestDTO_AD {
    @NotBlank(message = "ai cho may de trong")
    private String levelname;

    @NotNull(message = "ai cho may de trong")
    private float hourlywage;

    @NotBlank(message = "ai cho may de trong")
    private String description;


}
