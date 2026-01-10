package webpizza.com.vn.webapp.DTO.admin.ShopExportDTO_AD;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopExportUpdateRequestDTO_AD {
    @NotNull(message = "store id cannot empty")
    private Integer storeId;

    @NotNull(message = "employee id cannot empty")
    private Integer employeeId;

    private LocalDateTime exportDate;

    private String description;

    @NotNull(message = "order id cannot empty")
    private Integer orderId;
}
