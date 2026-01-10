package webpizza.com.vn.webapp.DTO.client.UserDTO_CL;

import jakarta.validation.constraints.Email;
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
public class UserUpdateRequestDTO_CL {

    @Length(min = 3, max = 70, message = "name must have at least 3 character")
    private String name;

    @NotBlank(message = "userName cannot empty")
    @Length(min = 3, max = 70, message = "username must have at least 3 character")
    private String username;

    @NotBlank(message = "password cannot empty")
    @Length(min = 6, max = 128, message = "password must have at least 6 - 128 character")
    private String password;

    private Integer gender;

    @NotNull(message = "birthday cannot empty")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class) // Thêm dòng này vào
    private LocalDate birthday;

    @NotBlank(message = "email cannot empty")
    @Email(message = "The correct email structure is <name@gmail.com>")
    private String email;

    @Pattern(message = "The correct phone structure is xxxx-xxx-xxx", regexp = "^\\d{4}\\d{3}\\d{3}$")
    private String phone;

    @Length(max = 500)
    private String address;

    // @NotNull(message = "Mức lương không được để trống")
    // @Min(value = 1, message = "Mức lương thấp nhất là 1")
    // private Integer levelId; //value = 1 là chấp nhận số từ 1 trở lên

    // @NotNull(message = "khong dc de trong")
    // private Integer isActive;
}
