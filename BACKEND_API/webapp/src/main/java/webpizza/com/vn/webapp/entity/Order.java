package webpizza.com.vn.webapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /*ánh xạ quan hệ từ bảng user tới order thông qua khóa ngoại
    cashierId 
    + lưu ý cha là User một user có thể đặt nhiều orders:
    + con là order nhiều đơn hàng chỉ nên dc đặt bởi một user: 
    + joincolumn tham chiếu thông qua trg khóa ngoại ở bảng order có tên là..*/
    @ManyToOne
    @JoinColumn(name = "cashier_id")
    private User cashierId;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customerId;

    @ManyToOne
    @JoinColumn(name = "payment_type_id")
    private PaymentTypes paymentTypeId;

    @Column(name = "ship_name")
    private String shipName;

    @Column(name = "ship_address")
    private String shipAddress;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Column(name = "shipped_date")
    private LocalDate shippedDate;

    @Column(name = "paid_date")
    private LocalDate paidDate;

    @Column(name = "status")
    private Integer status;

    @Column(name = "ship_method")
    private String shipMethod;

    @Column(name = "note")
    private String note;

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

    //giup hien thi chi tiet don hang len orderInformation de theo doi don hang
    @OneToMany(mappedBy = "orderId")
    private java.util.List<OrderDetail> orderDetails;
}