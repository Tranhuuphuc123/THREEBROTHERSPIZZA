package webpizza.com.vn.webapp.service.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import webpizza.com.vn.webapp.DTO.client.OrderDTO_CL.OrderRequestDTO_CL;
import webpizza.com.vn.webapp.entity.Order;
import webpizza.com.vn.webapp.entity.OrderDetail;
import webpizza.com.vn.webapp.entity.PaymentTypes;
import webpizza.com.vn.webapp.entity.Product;
import webpizza.com.vn.webapp.entity.User;
import webpizza.com.vn.webapp.repository.OrderDetailsRepository;
import webpizza.com.vn.webapp.repository.OrderRepository;
import webpizza.com.vn.webapp.repository.PaymentTypeRepository;
import webpizza.com.vn.webapp.repository.ProductRepository;
import webpizza.com.vn.webapp.repository.PromotionRepository;
import webpizza.com.vn.webapp.repository.UserRepository;

@Service
public class OrderServiceCL {
    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderDetailsRepository orderDetailsRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PaymentTypeRepository paymentTypeRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private PromotionRepository promotionRepo;


    /**I_get all**/
    public ResponseEntity<?> getOrdersByCustomer(Integer customerId) {
        Map<String, Object> response = new HashMap<>();
        try {
            User user = userRepo.findById(customerId).orElse(null);
            if (user == null) {
                response.put("statuscode", 404);
                response.put("msg", "Customer not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            java.util.List<Order> orders = orderRepo.findByCustomerId(user);
            response.put("data", orders);
            response.put("statuscode", 200);
            response.put("msg", "Get orders successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("statuscode", 500);
            response.put("msg", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /**II_create order**/
    /* Đảm bảo nếu lỗi thì rollback toàn bộ dữ liệu
     -> khi create 1 Order và nhiều OrderDetail. Nếu quá trình lưu OrderDetail 
     bị lỗi, Order vẫn nằm trong database gây ra đơn hàng rác (đơn hàng không
    có sản phẩm).
    => giải pháp dùng transaction rolback toàn bộ dữ liệu khắc phục tình trạng 
    tr*/
    @Transactional 
    public ResponseEntity<?> createOrder(OrderRequestDTO_CL objCreate){
        //khởi tạo biens lưu trữ kết quả trả về
        Map<String, Object> response = new HashMap<>();

        try{
             //lấy các đói tượng khóa ngoại xử lý trong order
            User cashierId = userRepo.findById(objCreate.getCashierId())
                    .orElseThrow(() -> new RuntimeException("Cashier not found"));
            User customerId = userRepo.findById(objCreate.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            PaymentTypes paymentTypeId = paymentTypeRepo.findById(objCreate.getPaymentTypeId())
                    .orElseThrow(() -> new RuntimeException("Payment method not found"));

            /*1. create 1 dòng vào table order cho các thông tin chung của đơn hàng*/
            Order order = new Order();

            /*2. thiết lặp nhận các khóa ngoại -> lưu tt chung của order*/
            order.setCashierId(cashierId);
            order.setCustomerId(customerId);
            order.setPaymentTypeId(paymentTypeId);

            order.setShipAddress(objCreate.getShipAddress());
            order.setOrderDate(objCreate.getOrderDate());
            order.setShippedDate(objCreate.getShippedDate());
            order.setPaidDate(objCreate.getPaidDate());
            order.setStatus(objCreate.getStatus());
            order.setShipMethod(objCreate.getShipMethod());
            order.setNote(objCreate.getNote());

            //nhơ entity của order lưu vào
            Order savedOrder =orderRepo.save(order);

            /*3. create nhiều dòng vào table order details cho các thông tin chi tiết của 
            đơn hàng
            => sử dụng vòng lặp để lặp qua từng sản phẩm con vào trong order
            => cần kiểm tra xem orderdetail lưu ok trc cần đk để nếu lõi thì 
            rollback toàn bộ dữ liệu tránh tình trạng đơn hàng rác
            ==> Tóm lại: Lưu danh sách sản phẩm (Order Details): Sử dụng vòng lặp để duyệt
            qua mảng orderDetails gửi từ Frontend, lưu từng sản phẩm vào bảng chi tiết và
            gắn kết chúng với mã đơn hàng vừa tạo.*/
            if (objCreate.getOrderDetails() != null) {
                for (OrderRequestDTO_CL.OrderDetailRequestDTO_CL ods : objCreate.getOrderDetails()) {
                    Product product = productRepo.findById(ods.getProductId())
                            .orElseThrow(() -> new RuntimeException("Product not found ID: " + ods.getProductId()));
                    
                    OrderDetail orderDetail = new OrderDetail();
                    orderDetail.setOrderId(savedOrder); // Gán đúng order vừa saved
                    orderDetail.setProductId(product);
                    
                    // Xử lý Promotion (có thể null nên dùng optional an toàn)
                    if (ods.getPromotionId() != null) {
                        promotionRepo.findById(ods.getPromotionId()).ifPresent(orderDetail::setPromotionId);
                    }

                    orderDetail.setQuantity(ods.getQuantity());
                    orderDetail.setUnitPrice(ods.getUnitPrice());
                    orderDetail.setSubtotal(ods.getUnitPrice() * ods.getQuantity());
                    orderDetail.setOrderDetailStatus(0);// Sử dụng Integer: 0 là Mới/Chờ xử lý

                    orderDetailsRepo.save(orderDetail);
                }
            }

            // 4. Trả về kết quả
            response.put("data", savedOrder);
            response.put("statuscode", 201);
            response.put("msg", "Create Order successfully!");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch(Exception e){
            response.put("statuscode", 500);
            response.put("msg", "Error: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
