package webpizza.com.vn.webapp.controller.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import webpizza.com.vn.webapp.service.client.PaymentTypeServiceCL;

@RestController
@RequestMapping("/api/client/payment_types")
public class PaymentControlerCL {

    @Autowired
    private PaymentTypeServiceCL paymentTypeServiceAD;
    
     /*I_0 get value khong phân trang*/
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAlls(){
       //gọi đến service thực hiện truy vấn CRUD - cụ thể là getAll dữ liệu mà mình viết logic bên đó
		return  paymentTypeServiceAD.getPaymentTypes();
    }

    
    /***************** I-12: getById *******************/
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id){
        //yeu cau service tra  ve id
        return paymentTypeServiceAD.getById(id);
    }

}
