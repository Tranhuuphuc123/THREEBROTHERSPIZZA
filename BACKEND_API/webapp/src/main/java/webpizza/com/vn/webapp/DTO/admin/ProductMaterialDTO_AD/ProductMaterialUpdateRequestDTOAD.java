package webpizza.com.vn.webapp.DTO.admin.ProductMaterialDTO_AD;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterialUpdateRequestDTOAD {

    @NotNull(message = "ProductId cannot be empty")
    private Integer productId;

    @NotNull(message = "MaterialId cannot be empty")
    private Integer materialId;

    @NotBlank(message = "Unit cannot be empty")
    private String unit;

    @NotNull(message = "StandardPrice cannot be empty")
    private Float standardPrice;
}
