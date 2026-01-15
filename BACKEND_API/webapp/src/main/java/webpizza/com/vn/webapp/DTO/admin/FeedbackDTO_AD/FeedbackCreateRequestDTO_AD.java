package webpizza.com.vn.webapp.DTO.admin.FeedbackDTO_AD;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackCreateRequestDTO_AD {
    @NotNull(message = "product_id cannot empty")
    private Number productId;

    @NotNull(message = "user_id cannot empty")
    private Number userId;

    @NotBlank(message = "message cannot empty")
    private String message;

    @NotNull(message = "rating cannot empty")
    private Number rating;

    @NotNull(message = "is_active cannot empty")
    private Number isActive;
}
