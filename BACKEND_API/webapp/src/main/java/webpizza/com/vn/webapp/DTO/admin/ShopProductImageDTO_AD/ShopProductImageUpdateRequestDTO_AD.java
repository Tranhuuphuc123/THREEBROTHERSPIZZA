package webpizza.com.vn.webapp.DTO.admin.ShopProductImageDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopProductImageUpdateRequestDTO_AD {
     @NotNull(message = "productId cannot empty")
    private Integer productId;

    private String image;
}
