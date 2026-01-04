package webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateRequestDTOAD {

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    private String image;

    private String shortDescription;

    private String description;

    @NotNull(message = "price is required")
    private Float price;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private Integer isActive;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;
}
