package webpizza.com.vn.webapp.controller.admin;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import webpizza.com.vn.webapp.service.admin.PromotionServiceAD;

@RestController
@RequestMapping("api/admin/Promotions")
public class PromotionControllerAD {
    @Autowired
    private PromotionServiceAD promotionServiceAD;

     /* I _  get */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProIndex(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                           @RequestParam(defaultValue = "3") Integer pageSize,
                                                           @RequestParam(defaultValue = "id") String sortBy){
        //goi service thuc thi method  getall
        return promotionServiceAD.getAllPromotionPagination(pageNumber,pageSize, sortBy);                                                         
    }
}
