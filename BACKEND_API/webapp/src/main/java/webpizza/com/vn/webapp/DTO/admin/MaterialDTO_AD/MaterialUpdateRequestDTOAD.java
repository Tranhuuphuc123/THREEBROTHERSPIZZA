package webpizza.com.vn.webapp.DTO.admin.MaterialDTO_AD;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialUpdateRequestDTOAD {
      @NotBlank(message = "This field cannot be empty")
    private String name;

    private String img;
    
    @NotNull(message = "This field cannot be empty")
    private Integer supplierId;

    @NotBlank(message = "This field cannot be empty")
    private String unit;

    @NotNull(message = "This field cannot be empty")
    private Integer quantity;

    @NotNull(message = "This field cannot be empty")
    private Float price;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class) // Thêm dòng này vào
    private LocalDate expireDate;

}
