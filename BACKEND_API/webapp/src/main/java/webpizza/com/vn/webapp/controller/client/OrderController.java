package webpizza.com.vn.webapp.controller.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import webpizza.com.vn.webapp.DTO.admin.RoleDTO_AD.RoleCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.client.OrderDTO_CL.OrderRequestDTO_CL;
import webpizza.com.vn.webapp.service.client.OrderServiceCL;

@RestController
@RequestMapping("/api/client/orders")
public class OrderController {
    @Autowired
    private OrderServiceCL orderServiceCL;


    /***I get all order đơn hàng***/
    @GetMapping("/get-orders-by-customer/{customerId}")
    public ResponseEntity<?> getOrdersByCustomer(@PathVariable Integer customerId) {
        try {
            return orderServiceCL.getOrdersByCustomer(customerId);
        } catch (Exception ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("data", null);
            response.put("statuscode", 500);
            response.put("msg", "System error: " + ex.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /** II. Create order - Khởi tạo đơn hàng từ thông tin người dùng gửi lên**/
    @PostMapping("/create-new-order")
    public ResponseEntity<?> create(@RequestBody OrderRequestDTO_CL objCreate) {
        try {
            return orderServiceCL.createOrder(objCreate);
        } catch (Exception ex) {
            Map<String, Object> response = new HashMap<>();
            response.put("data", null);
            response.put("statuscode", 500);
            response.put("msg", "System error: " + ex.getMessage());

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }





}
