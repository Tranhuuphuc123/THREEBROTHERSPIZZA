package webpizza.com.vn.webapp.controller.client;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserCreateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserUpdateRequestDTO_CL;
import webpizza.com.vn.webapp.service.client.UserServiceCL;


@RestController
@RequestMapping("/api/client/users")
public class UserControllerCL {

    //tiem phu thuoc autowired UserService vao
    @Autowired
    private UserServiceCL userServiceCL;

    /*************1-1: getall có phân trang**********************/
  
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
        return userServiceCL.getAllUserPagination(pageNumber, pageSize, sortBy);
    }

     
    /***************** 1-2: getById *******************/
    //@CrossOrigin(origins = "${client.url}") 
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id){
        //yeu cau service tra  ve id
        return userServiceCL.getById(id);
    }



    /*****************-2 create**************************/
    //@CrossOrigin(origins = "${client.url}") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody UserCreateRequestDTO_CL objDTO){
        /* * Giải thích: 
        * 1. @RequestBody: Tự động chuyển JSON từ Client gửi lên thành object UserCreateRequestDTO_CL.
        * 2. @Valid: Kích hoạt việc kiểm tra các annotation @NotBlank, @Length trong DTO của bạn.
        * 3. Không còn MultipartFile vì bạn đã lược bỏ phần upload ảnh cho Client.
        */
    
        return userServiceCL.createUser(objDTO);
    }



   /********************3 - delete**********************************/
   //@CrossOrigin(origins = "${client.url}") 
   @DeleteMapping("/delete/{id}")
   public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id){
       return userServiceCL.deleteUsre(id);
   }

   /*********************4- update**************************************/
   //@CrossOrigin(origins = "${client.url}") 
   @PutMapping("/update/{id}")
   public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id,
                                                     @RequestParam(value = "file", required = false) MultipartFile file,
                                                     @RequestParam("data") String jsonData){
       //goi class ObjectMapper de mapp json(data) gui len -> parse chuyen json do thanh value va xu ly luu csdl trong table user
       ObjectMapper objectMapper = new ObjectMapper();

       //goi khoi tao lop dto cua UserDTO
       UserUpdateRequestDTO_CL objDTO = null;

       //tien hanh cho dto doc vaf ghi nhan valuetu json gui len da dc map thong qua lop chuyen ObjectMapper
       try{
           objDTO = objectMapper.readValue(jsonData, UserUpdateRequestDTO_CL.class);
       } catch (Exception e) {
           throw new RuntimeException(e);
       }

       return userServiceCL.updateUser(id, objDTO, file);
   }
}
