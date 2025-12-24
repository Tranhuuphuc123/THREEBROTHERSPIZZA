package webpizza.com.vn.webapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users_roles")
public class UserHasRoles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore /* Thêm Annotation này parrse json tránh tránh lỗi Infinite Recursion 
    (vòng lặp vô tận) ở bản trung gian nó sẽ Ngắt: Khi từ user xem userhasroles, 
    dừng việc lặp đi ngc lại userhasrole sang user cứ mãi lặp đi lặp lại  */
    private User user;

    @ManyToOne
    @JoinColumn(name = "role_id")
    @JsonIgnore 
    private Role role;
}
