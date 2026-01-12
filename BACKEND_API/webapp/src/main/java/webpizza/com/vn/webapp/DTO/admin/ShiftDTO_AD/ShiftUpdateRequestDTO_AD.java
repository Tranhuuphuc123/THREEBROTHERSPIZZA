package webpizza.com.vn.webapp.DTO.admin.ShiftDTO_AD;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftUpdateRequestDTO_AD {
   @NotBlank(message = "shiftName cannot empty")
    private String shiftName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    @NotNull(message = "wageMultiplier cannot empty")
    private Float wageMultiplier;

    private Float bonus;

}
