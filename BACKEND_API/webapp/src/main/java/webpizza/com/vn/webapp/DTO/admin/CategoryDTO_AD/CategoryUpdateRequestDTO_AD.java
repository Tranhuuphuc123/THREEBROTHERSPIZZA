package webpizza.com.vn.webapp.DTO.admin.CategoryDTO_AD;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryUpdateRequestDTO_AD {
    @NotBlank(message = "khong duoc de trong")
    private String code;

    @NotBlank(message = "khong duoc de trong")
    private String name;
    
    private String description;
}
