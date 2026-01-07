package webpizza.com.vn.webapp.DTO.admin.ProductMaterialDTO_AD;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterialUpdateRequestDTOAD {

    @NotNull(message = "This field cannot be empty")
    private Integer productId;

    @NotNull(message = "This field cannot be empty")
    private Integer materialId;

    @NotBlank(message = "This field cannot be empty")
    private String unit;

    @NotNull(message = "This field cannot be empty")
    private Float standardPrice;
}
