package webpizza.com.vn.webapp.controller.admin;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

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
                                                     @RequestParam(defaultValue = "id") String sortBy){
        // goi service thuc hien truy van hien thi tat ca thong tin cua table user co phan trang
        return salaryLevelServiceAD.getAllSalaryLevelPagination(pageNumber, pageSize, sortBy);
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
    public ResponseEntity<Map<String, Object>> createSup (@RequestParam("file") MultipartFile file,
                                                         @RequestParam("data") String jsonData){
        //khoi tao lop ObjectMapper de map json(param:data)  -> parse(chuyen) json data thanh value trong dto -> day len entity luu vao csdl
        ObjectMapper objectMapper = new ObjectMapper();
        
        //khoi tao dto
        SalaryLevelCreateRequestDTO_AD objDTO = null;

        //tien hanh cho dto doc va ghi nhan data  tu json gui len map thogn qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, SalaryLevelCreateRequestDTO_AD.class);
        }catch(Exception e){
            e.printStackTrace();
        }

        return salaryLevelServiceAD.createSalaryLevel(objDTO, file);
    }

    /*III - delete */
    //@CrossOrigin(origins = "${client.url}") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteSup(@PathVariable Integer id){
        return salaryLevelServiceAD.deleteSalaryLevel(id);
    }


    /*IV - update */
    //@CrossOrigin(origins = "${client.url}") 
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateSup(@PathVariable Integer id,
                                                        @RequestParam(value = "file", required = false) MultipartFile file,
                                                         @RequestParam("data") String jsonData){
        //khoi tao lop ObjectMapper de map json(param:data)  -> parse(chuyen) json data thanh value trong dto -> day len entity luu vao csdl
        ObjectMapper objectMapper = new ObjectMapper();

         //khoi tao dto
        SalaryLevelUpdateRequestDTO_AD objDTO = null;

         //tien hanh cho dto doc va ghi nhan data  tu json gui len map thogn qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, SalaryLevelUpdateRequestDTO_AD.class);
        }catch(Exception e){
            e.printStackTrace();
        }

        return salaryLevelServiceAD.updateSupplier(id, objDTO, file);
    }
}
