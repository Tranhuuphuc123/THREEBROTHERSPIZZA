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
import webpizza.com.vn.webapp.DTO.admin.SalaryLevelDTO_AD.SalaryLevelCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.SalaryLevelDTO_AD.SalaryLevelUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.SalaryLevelServiceAD;

@RestController
@RequestMapping("/api/admin/salary_levels")
public class SalaryLevelControllerAD {
    @Autowired
    private SalaryLevelServiceAD salaryLevelServiceAD;

    
    /*************1- getall**********************/
   /*  
     -> @CrossOrigin(origins = "${client.url}") : cho phép localhost 8080 chấp nhận
    chay localhost 3000 khi localhost 8080 đang chay
     -> ${client.url}: thì trong application.properties mình đã cấu hình là 
     client.url = "http://localhost:3000" nên ở đây chỉ cần lôi key là đc quản lý 
     cấu hình tập trung
    * */
    //@CrossOrigin(origins = "${client.url}") 
    @GetMapping
    public ResponseEntity<Map<String, Object>> index(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                     @RequestParam(defaultValue = "3") Integer pageSize,
                                                     @RequestParam(defaultValue = "id") String sortBy,
                                                    @RequestParam(required = false) String search){
        // goi service thuc hien truy van hien thi tat ca thong tin cua table user co phan trang
        return salaryLevelServiceAD.getAllSalaryLevelPagination(pageNumber, pageSize, sortBy, search);
    }

    /***************** 1-2: getById *******************/
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id){
        //yeu cau service tra  ve id
        return salaryLevelServiceAD.getById(id);
    }


    /* II - create */
     //@CrossOrigin(origins = "${client.url}") 
    @PostMapping("/create")
        public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody SalaryLevelCreateRequestDTO_AD objCreate){
            try{
                return salaryLevelServiceAD.createSalaryLevel(objCreate);
            }catch(Exception ex){
                Map<String, Object> response = new HashMap<>();

                response.put("data", ex.getMessage());
                response.put("statuscode",500);
                response.put("msg","create failed!  please seen again");

                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }


    /*III - delete */
    //@CrossOrigin(origins = "${client.url}") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id){
        return salaryLevelServiceAD.deleteSalaryLevel(id);
    }


    /*IV - update */
    //@CrossOrigin(origins = "${client.url}") 
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id, @RequestBody SalaryLevelUpdateRequestDTO_AD objUpdate){
        return salaryLevelServiceAD.updateSalaryLevel(id, objUpdate);
    }
}
