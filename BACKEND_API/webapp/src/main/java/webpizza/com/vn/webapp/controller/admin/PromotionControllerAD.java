package webpizza.com.vn.webapp.controller.admin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import jakarta.validation.Valid;
import webpizza.com.vn.webapp.DTO.admin.PromotionDTO_AD.PromotionCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.PromotionDTO_AD.PromotionUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.PromotionServiceAD;

@RestController
@RequestMapping("api/admin/promotions")
public class PromotionControllerAD {
    @Autowired
    private PromotionServiceAD promotionServiceAD;

     /* I _0  get không phân trang*/
    @GetMapping("/listPro")
    public ResponseEntity<Map<String, Object>> getPro(){
        //nhơ service trả về value
        return promotionServiceAD.getAllPromotion();
    }

    /* I _1  get có phân trang*/
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id){
        //yeu cau service tra  ve id
        return promotionServiceAD.getById(id);
    }


    /* I _2  get có phân trang*/
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProPagination(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                           @RequestParam(defaultValue = "3") Integer pageSize,
                                                           @RequestParam(defaultValue = "id") String sortBy,
                                                           @RequestParam(required = false) String search){
        //goi service thuc thi method  getall
        return promotionServiceAD.getAllPromotionPagination(pageNumber,pageSize, sortBy, search);                                                         
    }

    /** II - create permission**/
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody PromotionCreateRequestDTO_AD objCreate){
        try{
            return promotionServiceAD.createPromotion(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","Create Promotion success");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /** III - update pẻmission **/
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable(value = "id") Integer id, 
                                                      @RequestBody PromotionUpdateRequestDTO_AD objUpdate){
        return promotionServiceAD.updatePromotion(id, objUpdate);
    }

    /** IV - delete permission **/
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable(value = "id") Integer id){
        return promotionServiceAD.deletePro(id);
    }
}
