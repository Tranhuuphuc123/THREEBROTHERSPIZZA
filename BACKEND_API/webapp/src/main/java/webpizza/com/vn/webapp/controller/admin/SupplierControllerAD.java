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

import webpizza.com.vn.webapp.DTO.admin.SupplierDTO_AD.SupplierCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.SupplierDTO_AD.SupplierUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.SupplierServiceAD;

@RestController
@RequestMapping("/api/admin/suppliers")
public class SupplierControllerAD {
    @Autowired
    private SupplierServiceAD supplierServiceAD;

    /*I_0 get value khong phân trang*/
    @GetMapping("/all-list")
    public ResponseEntity<Map<String, Object>> getAlls(){
       //gọi đến service thực hiện truy vấn CRUD - cụ thể là getAll dữ liệu mà mình viết logic bên đó
		return  supplierServiceAD.getRoles();
    }

    /* I _1  get */
    /*  
     -> @CrossOrigin(origins = "${client.url}") : cho phép localhost 8080 chấp nhận
    chay localhost 3000 khi localhost 8080 đang chay
     -> ${client.url}: thì trong application.properties mình đã cấu hình là 
     client.url = "http://localhost:3000" nên ở đây chỉ cần lôi key là đc quản lý 
     cấu hình tập trung
    * */
    //@CrossOrigin(origins = "${client.url}") 
    @GetMapping
    public ResponseEntity<Map<String, Object>> getSupIndex(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                           @RequestParam(defaultValue = "3") Integer pageSize,
                                                           @RequestParam(defaultValue = "id") String sortBy,
                                                           @RequestParam(required = false) String search){
        //goi service thuc thi method  getall
        return supplierServiceAD.getAllSupplierPagination(pageNumber,pageSize, sortBy, search);                                                         
    }

    
    /***************** I-2: getById *******************/
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id){
        //yeu cau service tra  ve id
        return supplierServiceAD.getById(id);
    }


    /* II - create */
     //@CrossOrigin(origins = "${client.url}") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createSup (@RequestParam("file") MultipartFile file,
                                                         @RequestParam("data") String jsonData){
        //khoi tao lop ObjectMapper de map json(param:data)  -> parse(chuyen) json data thanh value trong dto -> day len entity luu vao csdl
        ObjectMapper objectMapper = new ObjectMapper();
        
        //khoi tao dto
        SupplierCreateRequestDTO_AD objDTO = null;

        //tien hanh cho dto doc va ghi nhan data  tu json gui len map thogn qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, SupplierCreateRequestDTO_AD.class);
        }catch(Exception e){
            e.printStackTrace();
        }

        return supplierServiceAD.createSupplier(objDTO, file);
    }

    /*III - delete */
    //@CrossOrigin(origins = "${client.url}") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deleteSup(@PathVariable Integer id){
        return supplierServiceAD.deleteSupplier(id);
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
        SupplierUpdateRequestDTO_AD objDTO = null;

         //tien hanh cho dto doc va ghi nhan data  tu json gui len map thogn qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, SupplierUpdateRequestDTO_AD.class);
        }catch(Exception e){
            e.printStackTrace();
        }

        return supplierServiceAD.updateSupplier(id, objDTO, file);
    }
}
