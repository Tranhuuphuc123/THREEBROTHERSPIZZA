package webpizza.com.vn.webapp.DTO.admin.ShopCategoryDTO_AD;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShopCategoryUpdateRequestDTO_AD {
    @NotBlank(message = "category code cannot empty")
    @Length(max = 50, message = "Category codes cannot exceed 100 characters.")
    private String categoryCode;

    @NotBlank(message = "category name cannot empty")
    @Length(min = 3, max = 50, message = "Category name must have at least 3 characters")
    private String categoryName;

    private String description;

    private String image;
}
