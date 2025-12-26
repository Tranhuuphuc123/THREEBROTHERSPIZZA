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
    @Column(name = "supplier_code")
    private String supplierCode;

    @NotBlank(message = "khong dc de supplierName trong")
    @Column(name = "supplier_name")
    private String supplierName;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String img;
}
