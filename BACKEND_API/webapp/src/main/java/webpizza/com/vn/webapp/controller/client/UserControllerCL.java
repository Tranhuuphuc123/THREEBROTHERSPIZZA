package webpizza.com.vn.webapp.controller.client;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserCreateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserInformationByOrderResponseDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserUpdateRequestDTO_CL;
import webpizza.com.vn.webapp.JWT.JwtTokenProvider;
import webpizza.com.vn.webapp.entity.User;
import webpizza.com.vn.webapp.service.client.UserServiceCL;


@RestController
@RequestMapping("/api/client/users")
public class UserControllerCL {

    //tiem phu thuoc autowired UserService vao
    @Autowired
    private UserServiceCL userServiceCL;

    @Autowired 
    private JwtTokenProvider jwtTokenProvider;

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

    /*1-3 lấy thông tin user từ token khi login: phục vụ chức năng đổ thông tin 
    user vào order page khi login mới đc đặt hàng */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String bearerToken){
        //nếu như token nhân về không đúng chuẩn có jwt có: Bearer <token> thi khong xử lý
        if(bearerToken == null || !bearerToken.startsWith("Bearer ")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("Invalid Authorization header");
        }

        //lấy token thì bỏ chữ Bearer đi: cắt 7 ký tự đầu tính từ chữ Bearer + dấu cách
        String token = bearerToken.substring(7);

        //trích xuất username từ token giải mã ra
        String username = jwtTokenProvider.extractUsername(token);
        //trả về username
        Optional<User> optUser =  userServiceCL.getFindByUsername(username);
        if(optUser.isEmpty()){
            //tìm không tháy user từ username key trong token trên localstorage
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body("User not found");
        }

        //trả về thong tin user ở lơp dto thui và gán vào user ở entity
        User user = optUser.get();
        UserInformationByOrderResponseDTO_CL userDTO = new UserInformationByOrderResponseDTO_CL();

        userDTO.setName(user.getName());
        userDTO.setUsername(user.getUsername());
        userDTO.setPhone(user.getPhone());
        userDTO.setEmail(user.getEmail());
    
        return ResponseEntity.ok(userDTO);
       
    }



    /*****************_ 2-1 create**************************/
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

    /******************2-2 ACTIVE USER - XÁC NHẬN TÀI KHOẢN EMAIL KHI CREATE ACCOUNT XONG********
     * method này là sau khi create tài khoản xong thì cần xác minh lại qua email
     * email sẽ cung cấp cái link xác mình từ api này đẻ coi user đk có email và activeCode 
     * UUID(khóa bí mật á) coi có tòn tại và khớp không nếu ok thì nó tiến hành kích hoạt 
     * lại is_active của account user khi create xong từ 0 thành 1 để kích hoạt tài khoản
    */
    @GetMapping("/active-account")
    public ResponseEntity<Map<String, Object>> ActiveAccount(@RequestParam String email, @RequestParam String activeCode) {
        //nhờ service kích hoạt
        return userServiceCL.activeAccount(email, activeCode);
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
