package webpizza.com.vn.webapp.DTO.admin.CategoryDTO_AD;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryCreateRequestDTO_AD {

    @NotBlank(message = "This field cannot be empty")
    private String code;

    @NotBlank(message = "This field cannot be empty")
    private String name;
    
    private String description;
}
