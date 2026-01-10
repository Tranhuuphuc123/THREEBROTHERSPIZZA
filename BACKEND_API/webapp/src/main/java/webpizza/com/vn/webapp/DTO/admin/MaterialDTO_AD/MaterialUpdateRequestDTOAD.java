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
    @NotBlank(message = "name cannot be empty")
    private String name;

    private String img;
    
    @NotNull(message = "SupplierId cannot be empty")
    private Integer supplierId;

    @NotBlank(message = "Unit cannot be empty")
    private String unit;

    @NotNull(message = "Quantity cannot be empty")
    private Integer quantity;

    @NotNull(message = "Price cannot be empty")
    private Float price;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class) // Thêm dòng này vào
    private LocalDate expireDate;

}
