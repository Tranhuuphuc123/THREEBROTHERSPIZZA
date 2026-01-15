package webpizza.com.vn.webapp.service.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.entity.PaymentTypes;
import webpizza.com.vn.webapp.repository.PaymentTypeRepository;

/* xử lý service cho lớp paymenttypes trong csdl */
@Service
public class PaymentTypeServiceCL {
    @Autowired
    private PaymentTypeRepository paymentTypeRepo;

     /*tao bien string lay url cau hinh luu file da thiet lap ben application.properties
    * @Value: annotation dc su dung de gan gia tri cho mot bien tu cac nguon:
    *  + application.properties/application.yaml
    *  ....
    * */
    @Value("${file.upload-dir}")
    private String uploadDir;


    /* I-0 hiển thị không phân trang */
    /*I_0 trả về danh sách suppliers không phân trang*/
    public ResponseEntity<Map<String, Object>> getPaymentTypes() {
        //khởi tạo biến lưu trữ kết quả trả về
        Map<String, Object> response = new HashMap();

        //b - Yêu câu repository lấy dữ liệu -> gọi đén Repository.mehthod trong crudRepository
        List<PaymentTypes> lsSupplier = (List<PaymentTypes>) paymentTypeRepo.findAll();

        //c - trả về kết quả cho người dùng -> trả theo chuẩn restFullApi
        response.put("data", lsSupplier);
        response.put("statuscode", 200);
        response.put("msg", "get data successfully");

        return new ResponseEntity(response, HttpStatus.OK);
    }

     /*I_2: trả về danh sách PaymentTypes theo id cần tiềm */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<PaymentTypes> optFoundById = paymentTypeRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            PaymentTypes payEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", payEntity);
            response.put("statuscode", 201);
            response.put("msg", "Return id of PaymentTypes success");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve ket qua nguoi dung
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "Please seen result search");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

}
