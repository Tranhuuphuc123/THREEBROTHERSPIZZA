package webpizza.com.vn.webapp.DTO.admin.SupplierDTO_AD;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierUpdateRequestDTO_AD {
    @NotBlank(message = "khong dc de ma code trong")
    @Column(name = "code")
    private String code;

    @NotBlank(message = "khong dc de supplierName trong")
    @Column(name = "name")
    private String name;

    @Column(name = "img")
    private String img;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address")
    private String address;
    
    @Column(name = "description")
    private String description;
}
