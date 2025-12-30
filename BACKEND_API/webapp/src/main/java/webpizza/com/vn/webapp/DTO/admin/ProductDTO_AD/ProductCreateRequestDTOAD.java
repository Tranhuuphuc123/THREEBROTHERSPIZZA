package webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD;

import jakarta.persistence.Column;
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

    @NotNull(message = "PromotionId is required")
    private Integer promotionId;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "description")
    private String description;

    @NotNull(message = "price is required")
    private Float price;

    @NotNull(message = "Quantity is required")
    private Float quantity;

    private Integer isActive;

    @NotNull(message = "Category ID is required")
    private Integer categoryId;

    @NotNull(message = "Supplier ID is required")
    private Integer supplierId;
}
