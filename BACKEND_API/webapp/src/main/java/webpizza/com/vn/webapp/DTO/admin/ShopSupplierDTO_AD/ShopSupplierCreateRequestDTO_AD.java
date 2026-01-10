package webpizza.com.vn.webapp.DTO.admin.ShopSupplierDTO_AD;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopSupplierCreateRequestDTO_AD {
    @NotBlank(message = "supplierCode cannot empty")
    @Length(max = 50)
    private String supplierCode;

    @NotBlank(message = "supplierName cannot empty")
    @Length(min = 3, max = 70, message = " supplierName must have at least 3 characters")
    private String supplierName;

    private String description;

    private String image;
}
