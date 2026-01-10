package webpizza.com.vn.webapp.service.client;

import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserCreateRequestDTO_CL;
import webpizza.com.vn.webapp.DTO.client.UserDTO_CL.UserUpdateRequestDTO_CL;
import webpizza.com.vn.webapp.entity.Role;
import webpizza.com.vn.webapp.entity.User;
import webpizza.com.vn.webapp.entity.UserHasRoles;
import webpizza.com.vn.webapp.exceptions.ValidationErrorResponse;
import webpizza.com.vn.webapp.exceptions.Violations;
import webpizza.com.vn.webapp.repository.RoleRepository;
import webpizza.com.vn.webapp.repository.UserHasRolesRepository;
import webpizza.com.vn.webapp.service.auoth.EmailService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*lop luan ly logic code*/

@Service
public class UserServiceCL {

    @Autowired
    private webpizza.com.vn.webapp.repository.UserRepository userRepo;

    @Autowired
    private UserHasRolesRepository userHasRoleRepo;

    @Autowired
    private RoleRepository roleRepo;

    /* tiêm EmailService xử lý xác nhận email vào */
    @Autowired
    private EmailService emailService;


    /*tao bien string lay url cau hinh luu file da thiet lap ben application.properties
    * @Value: annotation dc su dung de gan gia tri cho mot bien tu cac nguon:
    *  + application.properties/application.yaml
    *  ....
    * */
    @Value("${file.upload-dir}")
    private String uploadDir;


    /*I_1 GET ->lay va do du lieu co phan trang*/
    public ResponseEntity<Map<String, Object>> getAllUserPagination(int pageNumber, int pageSize, String sortby){
        //a - khoi tao bien respone luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //b- yeu cau repository lay du lieu -> goi den repository goi den thao tac crud
        /*
        * Pageable: la mot giao dien trong spring data dc su dung de ho tro phan trang
        * sap xep trang
        *  + pageNUmber: trang so may(trang dang xem)
        *  + pageSize:  tong so luong trang
        *  + sortBy: sap xep trang cot nao: id or theo ten name...
        * */
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(sortby));
        Page<User> pageResult = userRepo.findAll(pageable);
        if(pageResult.hasContent()){
            //tra ket qua cho nguoi dung -> tra theo chuan restfull APi sieu cap vip pro
            response.put("data", pageResult.getContent());
            response.put("statuscode", 201);
            response.put("msg", "get data successfully");

            response.put("currentpage", pageNumber);
            response.put("isFirst", pageResult.isFirst());
            response.put("isLast", pageResult.isLast());
            response.put("hasNext", pageResult.hasNext());
            response.put("hasPrevious", pageResult.hasPrevious());
            response.put("totalPage", pageResult.getTotalPages());
            response.put("totalElement", pageResult.getTotalElements());

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
           response.put("data", null);
           response.put("statuscode", 404);
           response.put("msg", " No data");

           return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    
     /**I_2: Get xậy dựng mehod tra ve ket qua theo id******/
    /*nhu cach thuc cua getAllPagination no cung tra ve ket qua tuy nhien getallPaginattion
     * la method tra ve ket qua theo recored value hien thi ra tat ca value can co trng csdl
     * -> gio trong method nay ta can tra la tra ve ket qua la id cua record tuong ung thui
     * ==> trong bai nay ta phuc vu chuc nang update tuy nhien trc khi thuc thi method update
     * ta can tra ve ket qua la cac id tuong ung cac record tren csdl */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<User> optFoundById = userRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            User accountEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", accountEntity);
            response.put("statuscode", 201);
            response.put("msg", "The search result returns that the ID just searched exists.");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve ket qua nguoi dung
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "Please check again, the ID you just searched for does not exist.");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }



    /*II - 1 Post(create) - trong phần này có xử lý create có xác nhận qua gmail*/
    //MultipartFile: la mot interface trong spring, dc su dung de xu ly cac tep files -> dc upload thog qua giao thuc HTTP request
     //Nếu bạn có @Transactional: Nếu việc lưu Role bị lỗi, Spring sẽ tự động "xóa" luôn thằng User vừa tạo trước đó để đảm bảo dữ liệu trong Database luôn sạch sẽ, đúng cặp đúng cặp.
    @Transactional 
    public ResponseEntity<Map<String, Object>> createUser(UserCreateRequestDTO_CL objCreate){
        //a - khoi tao bien response de luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //b-1 xu ly service  validation exception kiem tra tinh hop le khi dien thong tin
        ValidationErrorResponse responseError = new ValidationErrorResponse();
        if(objCreate.getUsername().equalsIgnoreCase("Admin") || objCreate.getUsername().equalsIgnoreCase("quan tri vien")){
            responseError.getViolations().add(new Violations("username", "Do not use this name to register a user account."));
        }
        //b-2 xu ly password
        /*
      + phân tích:
            ^: Bắt đầu chuỗi.
            [a-zA-Z0-9._%+-]+: Một hoặc nhiều ký tự chữ, số, hoặc ký tự đặc biệt (., _, %, +, -).
            @: Ký tự bắt buộc.
            [a-zA-Z0-9.-]+: Một hoặc nhiều ký tự trong tên miền.
            .: Dấu chấm (thoát với \ vì . là ký tự đặc biệt).
            [a-zA-Z]{2,}: Tên miền có ít nhất 2 ký tự.
            $: Kết thúc chuỗi.*/
        String regExpn = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,20}$";
        /*
        +Pattern.compile(regExpn: Tạo ra một đối tượng Pattern. Đây là bước biên dịch (compile)
        biểu thức Regex (chuỗi regExpn) thành một đối tượng có thể sử dụng để so khớp hiệu quả.
        + Pattern.CASE_INSENSITIVE: Dây là một cờ (flag) tùy chọn. Nó cho phép việc so khớp không
         phân biệt chữ hoa/chữ thường.
        + Matcher matcher = pattern.matcher(objCreate.getPassword());: Chuỗi đầu vào cần kiểm tra
        (mật khẩu mà người dùng vừa nhập).
        * */
        Pattern pattern = Pattern.compile(regExpn,Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(objCreate.getPassword());

        // tao bien kiem tra mk co du manh regex chua
        boolean isPasswordIstrong = matcher.matches();
        if(isPasswordIstrong == false){
            responseError.getViolations().add(new Violations("password","Your password must contain uppercase letters, lowercase letters, and at least one special character."));
        }

        //c - kiem tra neu nguoi dung khong vi pham bat ke service validation nao thi cho luu
        if(responseError.getViolations().size() == 0){
            //c-1 khoi tao UserEntity
            User newEntity = new User();
            
            newEntity.setUsername(objCreate.getUsername());

            //xử ly ma hoa matkhau theo chuan bcrypt
            BCryptPasswordEncoder endCoder = new BCryptPasswordEncoder();
            newEntity.setPassword(endCoder.encode(objCreate.getPassword()));

            //set mac dinh la 1
            newEntity.setGender(1);  

            //lưu email
            newEntity.setEmail(objCreate.getEmail());

            //lk khoa ngoai cua table salary_level
            newEntity.setLevelId(1);

            //set mặc định là 0 - chưa kích hoạt đẻ xác nhận gmail thì mới kích hoạc là 1
            newEntity.setIsActive(0);

            /*tao khóa bí mật đẻ xác nhận gmail - nên sinh khóa bi mật 
            kiểu mã hóa UUID(mã hóa sang dạng ký tự đặc biệt)
            -> muốn mã hóa activeCode sang UUID thì search từ khóa "Generate UUID spring"
            -> truy cập vào trang: "https://www.baeldung.com/java-uuid"
            -> chọn phương thức mã hóa UUID sinh khóa bí mật(có nhiều method tôi chọn ở 
            đây là UUID theo randomString đi:  UUID uuid = UUID.randomUUID() ) */
            UUID uuid = UUID.randomUUID();
            newEntity.setActiveCode(uuid.toString());


           /** c-2 yeu cau repository luu lai khoi tao tren **
            * thuc hien nhan ten dk username va tien hanh kiem tra tranh 
            * trung ten username khi dang ky
           */
           User existingUser = userRepo.findByUsername(objCreate.getUsername());

           // c-3 thuc hien kiem tra ds data trong mysql co trung ten username nao khong
            if(existingUser != null){
                //nem loi thong bao de khong cho phep tao trung ten
                throw new ConstraintViolationException("The name you registered already exists, please choose a different name hahaaha", null);
            }else{
                User createEntity = userRepo.save(newEntity);

                /*tạo role mặc định cho user là customer khi client create tài khoản*/
                UserHasRoles newRole = new UserHasRoles();
                /*lấy role từ db -> gán cứng user mới create là role có id 4: customer luôn*/
                Role defaultRole = roleRepo.findById(4).orElseThrow(() -> new RuntimeException("The role doesn't exist lol"));

                newRole.setUser(createEntity);
                newRole.setRole(defaultRole);

                //lưu lại vào userhasrole
                userHasRoleRepo.save(newRole);


                /****xử lý xác nhận email khi đăng ký create tài khoản****/
                /*tạo biến chứa hình thức xác nhận email theo cách thức đơn giản
                SimpleMailMessage(không chứa file đính kèm khi gửi email)
                 >>>>qui trình hoạt động đoạn dưới đây như sau:<<<<<<<<
                  1/ đầu tiền khi gọi api create User này activeCode nó sẽ vãn là 0 chưa hoạt động đc
                  dù đã tạo thành công create user account(vì nó cần x/m email mới cho activeCode 1)
                  2/ sau đó ở api khi create account succes này ta gửi lên email kèm mã khóa bí mật UUID 
                  đã mã hóa từ activecode theo UUID kiểu mã hóa sang ký tự đặc biệt dạng chuỗi random á để chi ??
                   + thứ nhất là khi tạo xong tài khoản thì đúng là ok rồi nhưng muốn xác minh gmail cho chắc ăn mà 
                   muons xác minh với nhau thì cần khóa bí mật để an toàn và có cái đẻ so cho khớp
                   + thứ hai là khi gửi mail xác mình thì theo cấu trúc đơn giản là simpleMailMessage
                       ++ to: địa mail gửi đến cho mail của ai
                       ++ subject tên chủ đề gửi
                       ++ content nội dung gửi
                   + thứ ba khi emailService.sendemail gửi các nội dung đó đi thì email xác minh và gửi 
                   lại thong báo là chào bạn vui lòng nhấp link xác minh
                   --> lúc này email gửi link  
                            <a href=\"http://localhost:8080/api/authEmail/active-account?email=\""
                            + createEntity.getEmail() 
                            + "&active_code=\"" + createEntity.getActiveCode()   
                      chỗ đoạn này á là gửi link xác minh thực ra chính là link api thực hiện việc xác minh tài 
                      khoản bao gồm email có phải đúng email của người cần xác mình khi create tài khoản và gửi 
                      lên khong và activecode có khớp với khóa bí mật UUID activecode đã mã hóa khi create xong 
                      account chưa. Nếu ok thì luận lý api xác minh sẽ đc call và xác minh nếu đúng email của 
                      người vừa tạo và UUID activeCode khóa bí mật random á chính xác rồi thì nó sẽ xác thực 
                      thành công và biến activeCode ban đầu từ 0 thành 1, tài khoản sẽ đc kích hoạt và active 
                      code thành 1 thông báo  trạng thái là nó đã đc chấp nhận và có thể sử dụng
                */
                String to = createEntity.getEmail();
                String subject = "Verify registered account";
                String content = "Hello, " + createEntity.getUsername() 
                    + "Please verify your newly created account by clicking the following confirmation link to activate your account"
                    + ": <a href=\"http://localhost:8080/api/client/users/active-account?email="
                    + createEntity.getEmail() 
                    + "&activeCode=" + createEntity.getActiveCode()
                    + "\">Actice Account</a>";
                //tiến hành gửi email với các tham số khai báo để xác nhận email
                emailService.SendEmail(to, subject, content);
                

                //c-4 tra ve ket qua cho nguoi dung theo chuan restfullAPI
                response.put("data", createEntity);
                response.put("statuscode", 200);
                response.put("msg", " create user successfully");

                return new ResponseEntity<>(response, HttpStatus.CREATED);
            }
        }else{
            response.put("data", responseError);
            response.put("statuscode", 501);
            response.put("msg", " The data does not meet the requirements and needs to be reviewed.");

            return new ResponseEntity<>(response, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    
    

    /* II- 2: Tạo (Get) Service xác nhận kích hoạt account từ thông tin request user gửi lên 
    email khi tiến hành create account user(service này thực thi xác minh account kích hoạt 
    lại is_active của account mới create tư 0 thành 1 qua xác minh email) */
    public ResponseEntity<Map<String, Object>> activeAccount(String email, String activeCode){
         //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        // nhờ repo của user đi tiềm email và active code thông qua method ứng câu lênh query trong sql từ repo
        Optional<User> optFound = userRepo.findByEmailAndActiveCode(email, activeCode);
        if(optFound.isPresent()){
            //nếu tim đc thì kích hoạt tài khoản set isActive thành 1
            User entityUpdate = optFound.get();
            entityUpdate.setIsActive(1);
            
            //xóa bỏ activeCode đi mã kích hoạt bí mật này xóa đi
            entityUpdate.setActiveCode(null);

            //save lại trạng thái vừa thay đổi
            userRepo.save(entityUpdate);

            //trả về kết quả chuẩn restfull
            response.put("data", entityUpdate);
            response.put("statuscode", 200);
            response.put("msg", " active User successfully");

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }else{
            response.put("data", null);
            response.put("statuscode", 501);
            response.put("msg", " Account cannot be activated. ");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }




    /*III - Put(Update0*/
   public ResponseEntity<Map<String, Object>> updateUser(Integer id, UserUpdateRequestDTO_CL objEdit, MultipartFile file) {
    Map<String, Object> response = new HashMap<>();

    Optional<User> optFound = userRepo.findById(id);
    if (optFound.isPresent()) {
        User entityEdit = optFound.get();

        // Cập nhật thông tin cơ bản
        if (objEdit.getName() != null && !objEdit.getName().isEmpty()) {
            entityEdit.setName(objEdit.getName());
        }
        if (objEdit.getUsername() != null && !objEdit.getUsername().isEmpty()) {
            entityEdit.setUsername(objEdit.getUsername());
        }

        // Mã hóa mật khẩu nếu có thay đổi
        if (objEdit.getPassword() != null && !objEdit.getPassword().isEmpty()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            entityEdit.setPassword(encoder.encode(objEdit.getPassword()));
        }

        if (objEdit.getGender() != null) {
            entityEdit.setGender(objEdit.getGender());
        }
        
        if (objEdit.getBirthday() != null) {
            entityEdit.setBirthday(objEdit.getBirthday());
        }

        if (objEdit.getEmail() != null && !objEdit.getEmail().isEmpty()) {
            entityEdit.setEmail(objEdit.getEmail());
        }

        // Xử lý File Ảnh
        if (file != null && !file.isEmpty()) {
            try {
                String randomString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                String rootFolder = Paths.get("").toAbsolutePath().toString();
                String newFileName = randomString + "_" + file.getOriginalFilename();
                String filePath = rootFolder + File.separator + uploadDir + File.separator + newFileName;

                File destinationFile = new File(filePath);
                destinationFile.getParentFile().mkdirs();
                file.transferTo(destinationFile);

                // Xóa ảnh cũ (Chỉ xóa nếu tên ảnh cũ tồn tại)
                if (entityEdit.getAvatar() != null && !entityEdit.getAvatar().isEmpty()) {
                    Path delFilePath = Paths.get(rootFolder, uploadDir, entityEdit.getAvatar());
                    Files.deleteIfExists(delFilePath);
                }

                entityEdit.setAvatar(newFileName);
            } catch (IOException e) {
                // Log lỗi nhưng không làm dừng chương trình
                System.err.println("File saving failed: " + e.getMessage());
            }
        }

        if (objEdit.getPhone() != null && !objEdit.getPhone().isEmpty()) {
            entityEdit.setPhone(objEdit.getPhone());
        }
        if (objEdit.getAddress() != null && !objEdit.getAddress().isEmpty()) {
            entityEdit.setAddress(objEdit.getAddress());
        }

        // Cập nhật Mức lương
        // if (objEdit.getLevelId() != null && objEdit.getLevelId() > 0) {
        //     entityEdit.setLevelId(objEdit.getLevelId());
        // }
        
        // if (objEdit.getIsActive() != null) {
        //     entityEdit.setIsActive(objEdit.getIsActive());
        // }

        // Lưu vào DB
        userRepo.save(entityEdit);

        response.put("data", entityEdit);
        response.put("statuscode", 200);
        response.put("msg", "Update user successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);

    } else {
        response.put("data", null);
        response.put("statuscode", 404);
        response.put("msg", "Update user failed - User ID not found");
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}

    /*IV- Delete(xoa)*/
    public ResponseEntity<Map<String, Object>> deleteUsre(Integer id){
        //a - khoi tao bien response luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        // nho repository goi method tim kiem id can xoa
        /*
        * Optional:
        *  + la mot lop trong java(java.util.Optional) dc gioi thieu tu java 8
        *  + no la mot container object co the chua mot gia tri khong null  hoac rong emtpy
        *  + muc tieu chinh Optional la giup iam thieu loi NullPointerException khi ma minhf
        * xu ly voi cac gia tri null
        * */
        Optional<User> optFound = userRepo.findById(id);
        if(optFound.isPresent()){
            //neu ton tai id can tim thi lay no ra -> ghi nhan no vao entity
            User delEntity = optFound.get();

            /*xu ly tien hanh xoa ruot anh ung voi taikhoan cua anh do*/
            String rootFolder = Paths.get("").toAbsolutePath().toString();
            Path filePath = Path.of(rootFolder + File.separator + uploadDir + File.separator + delEntity.getAvatar());

            try{
                //tien hanh deleteIfExits co ton tai no moi xoa
                Files.deleteIfExists(filePath);
            }catch (IOException e){
                e.printStackTrace();
            }

            //nho repository xoa dat r
            userRepo.delete((delEntity));

            //tra ve ket qua nguioi dung chuan restfull api
            response.put("data", null);
            response.put("statuscode", 200);
            response.put("msg", "delete user successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve chuan restfull api thong bao la khong ton tai id can xoa
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "The deleted account no longer exists.");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


}
