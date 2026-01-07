package webpizza.com.vn.webapp.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "promotions")
public class Promotion{
  
    //tu tang auto_increment ben sql
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;
    
    @Column(name = "discount")
    private Float discount;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active")
    private Integer isActive;

    // updatable = false: không cho phép cập nhật sau khi tạo đảm bảo tính truy vết lịch sử
    /*@CreationTimestamp:Tự động gán giá trị thời gian hiện tại (NOW()) cho trường này khi
     bản ghi được chèn (INSERT) vào CSDL.*/
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // Khi INSERT: = NOW()

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}