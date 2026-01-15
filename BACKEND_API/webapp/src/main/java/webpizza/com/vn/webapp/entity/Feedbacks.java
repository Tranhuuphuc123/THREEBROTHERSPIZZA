package webpizza.com.vn.webapp.entity;

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
@Table(name = "feedbacks")
public class Feedbacks {
  
    //tu tang auto_increment ben sql
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Number id;

    @Column(name = "product_id")
    private Number productId;

    @Column(name = "user_id")
    private Number userId;

    @Column(name = "rating")
    private Number rating;

    @Column(name = "message")
    private String message;

    @Column(name = "is_active")
    private Number isActive;

}