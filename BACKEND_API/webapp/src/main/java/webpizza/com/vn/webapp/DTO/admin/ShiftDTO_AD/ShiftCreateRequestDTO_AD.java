package webpizza.com.vn.webapp.DTO.admin.ShiftDTO_AD;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftCreateRequestDTO_AD {
    @NotBlank(message = "ai cho may de trong")
    private String shiftName;

    @NotNull(message = "ai cho may de trong")
    private LocalDateTime startTime;

    @NotNull(message = "ai cho may de trong")
    private LocalDateTime endTime;

    @NotBlank(message = "ai cho may de trong")
    private float wageMultiplier;

    private float bonus;

}
