package webpizza.com.vn.webapp.DTO.admin.UserDTO_AD;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.time.LocalDate;

import org.hibernate.validator.constraints.Length;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserCreateRequestDTO_AD {
   
    @Length(min = 3, max = 70, message = "name must have at least 3 character")
    private String name;

    @NotBlank(message = "username cannot empty")
    @Length(min = 3, max = 70, message = "userName must have at least 3 character")
    private String username;

    @NotBlank(message = "password cannot empty")
    @Length(min = 6, max = 128, message = "password must have at least 6 -128 character")
    private String password;

    @NotNull(message = "gender cannot ")
    private Integer gender;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class) // Thêm dòng này vào
    private LocalDate birthday;

    @Email(message = "You must use the correct email structure: <name@gmail.com>")
    private String email;

    @Pattern(message = "You must use the corect phone: xxxx-xxx-xxx", regexp = "^\\d{4}\\d{3}\\d{3}$")
    private String phone;

    @Length(max = 500)
    private String address;

    @NotNull(message = "SalaryLevel cannot empty")
    @Min(value = 1, message = "The lowest salary is 1")
    private Integer levelId; //value = 1 là chấp nhận số từ 1 trở lên

    private Integer isActive;
}
