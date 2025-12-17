package webpizza.com.vn.webapp.controller.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserCreateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserUpdateRequestDTO_CL;
import webpizza.com.vn.webapp.service.client.UserServiceCL;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/client/users")
public class UserControllerCL {
    //tiem phu thuoc autowired UserService vao
    @Autowired
    private UserServiceCL userServiceCL;

    /*************1- getall**********************/
    /*  @CrossOrigin(origins = "http://localhost:3000": cho phép localhost 8080 chấp nhận
    chay localhost 3000 khi localhost 8080 đang chay
    * */
    @CrossOrigin(origins = "http://localhost:3000") 
    @GetMapping
    public ResponseEntity<Map<String, Object>> index(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                     @RequestParam(defaultValue = "3") Integer pageSize,
                                                     @RequestParam(defaultValue = "id") String sortBy){
        // goi service thuc hien truy van hien thi tat ca thong tin cua table user co phan trang
        return userServiceCL.getAllUserPagination(pageNumber, pageSize, sortBy);
    }

    /*****************-2 create**************************/
    @CrossOrigin(origins = "http://localhost:3000") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestParam("file") MultipartFile file,
                                                      @RequestParam("data") String jsonData){
        //goij class ObjeMapper de mapp json(param:data) -> parse(chuyen) json thanh valu trong dto -> day len entity user
        ObjectMapper objectMapper = new ObjectMapper();

        //goi khoi  tao lop dto userDTO
        UserCreateRequestDTO_CL objDTO = null;

        //tien hanh cho dto doc vaf ghi nhan data tu json dui len map thong qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, UserCreateRequestDTO_CL.class);
        }catch (Exception e){
            e.printStackTrace();
        }
        return userServiceCL.createUser(objDTO, file);
    }


   /********************3 - delete**********************************/
   @CrossOrigin(origins = "http://localhost:3000") 
   @DeleteMapping("/delete/{id}")
   public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id){
       return userServiceCL.deleteUsre(id);
   }

   /*********************4- update**************************************/
   @CrossOrigin(origins = "http://localhost:3000") 
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
