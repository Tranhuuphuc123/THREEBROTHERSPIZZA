package webpizza.com.vn.webapp.entity;

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
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Shifts")
public class Shifts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "shift_name")
    private String shiftName;

    @CreationTimestamp
    @Column(name = "start_time")
    private LocalDateTime startTime;

     @CreationTimestamp
    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "wage_multiplier")
    private float wageMultiplier;

    @Column(name = "bonus")
    private float bonus;

}
