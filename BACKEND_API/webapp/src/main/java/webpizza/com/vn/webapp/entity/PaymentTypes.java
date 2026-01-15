package webpizza.com.vn.webapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_types")
@Data // Tự động tạo Getter, Setter, toString, equals, hashCode
@NoArgsConstructor // Tạo constructor không tham số
@AllArgsConstructor // Tạo constructor đầy đủ tham số
public class PaymentTypes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "image")
    private String image;

    // updatable = false: không cho phép cập nhật sau khi tạo đảm bảo tính truy vết lịch sử
    /*@CreationTimestamp:Tự động gán giá trị thời gian hiện tại (NOW()) cho trường này khi
     bản ghi được chèn (INSERT) vào CSDL.*/
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Dùng camelCase cho trường Java

    /*@UpdateTimestamp:	Tự động cập nhật giá trị thời gian hiện tại (NOW()) cho trường này
    mỗi khi bản ghi được cập nhật (UPDATE).*/
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}