package webpizza.com.vn.webapp.DTO.admin.ShopImportDTO_AD;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopImportCreateRequestDTO_AD {

    @NotNull(message = "store id cannot empty")
    private Integer storeId;

    @NotNull(message = "employee id cannot empty")
    private Integer employeeId;

    private LocalDateTime importDate;
}
