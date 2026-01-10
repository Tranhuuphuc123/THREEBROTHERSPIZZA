package webpizza.com.vn.webapp.DTO.admin.ShopStoreDTO_AD;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShopStoreCreateRequestDTO_AD {

    @NotBlank(message = "storeCode cannot empty")
    @Length(max = 50)
    private String storeCode;

    @NotBlank(message = "storename cannot empty")
    @Length(min = 3, max = 70, message = " storeName must have at least 3 characters")
    private String storeName;

    private String description;
    
    private String image;
}
