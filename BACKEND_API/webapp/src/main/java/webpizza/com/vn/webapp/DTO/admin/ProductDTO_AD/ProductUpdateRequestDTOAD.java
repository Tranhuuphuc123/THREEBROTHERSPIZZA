package webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequestDTOAD {
    
    @NotBlank(message = "Code cannot be empty")
    private String code;

    @NotBlank(message = "Name cannot be empty")
    private String name;

    private String image;

    private String shortDescription;

    private String description;

    @NotNull(message = "Price cannot be empty")
    private Float price;

    @NotNull(message = "Quantity cannot be empty")
    private Integer quantity;

    private Integer isActive;

    @NotNull(message = "CategoryId cannot be empty")
    private Integer categoryId;

    private String productType;
}
