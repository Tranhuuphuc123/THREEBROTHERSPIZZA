package webpizza.com.vn.webapp.DTO.client.OrderDTO_CL;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*DTO vòng cha ngoài là dto chứ thông tin đơn hàng order */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO_CL {
    private Integer cashierId;
    private Integer customerId;
    private Integer paymentTypeId;
    private String shipName;
    private String shipAddress;
    private LocalDate orderDate;
    private LocalDate shippedDate;
    private LocalDate paidDate;
    private Integer status;
    private String shipMethod;
    private String note;


    /*tạo biến danh sách list chứa các orderDetail các sản phẩm trong 
    giỏ cart khi tạo đơn hàng lưu các đơn hàng product đó vào orderdetail 
    và orderdetail đc chứa trong order */
    private List<OrderDetailRequestDTO_CL> orderDetails;

    /*tạo thông tin đơn hàng chi tiết thông qua một request dto này
    => ta viết một class con trong class cha dto này như sau  thể hiện 
    thông tin chi tiết đơn hàng*/
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderDetailRequestDTO_CL{
        private Integer productId;
        private Integer promotionId;
        private Integer quantity;
        private Float unitPrice;
        private Integer orderDetailStatus;
        private Float subtotal;
    }
}
