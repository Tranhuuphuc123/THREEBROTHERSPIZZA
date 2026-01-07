package webpizza.com.vn.webapp.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_material")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "product_id", nullable = false)
    private Integer productId;

    @Column(name = "material_id", nullable = false)
    private Integer materialId;

    @Column(length = 50)
    private String unit;

    @Column(name = "standard_price", nullable = false)
    private Float standardPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
