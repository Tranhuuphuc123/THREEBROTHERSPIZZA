package webpizza.com.vn.webapp.service.admin;

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

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import webpizza.com.vn.webapp.DTO.admin.UserDTO_AD.UserCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.UserDTO_AD.UserUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.User;
import webpizza.com.vn.webapp.exceptions.ValidationErrorResponse;
import webpizza.com.vn.webapp.exceptions.Violations;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*lop luan ly logic code*/
@Service
public class UserServiceAD {

    @Autowired
    private webpizza.com.vn.webapp.repository.UserRepository userRepo;


    /**##THEM VALIDATION BAT LOI HIEN THI RA MAN HINH TAI FORM INPUT NHAP##**/
    @Autowired
    private Validator validator; // thêm dòng này

    /*tao bien string lay url cau hinh luu file da thiet lap ben application.properties
    * @Value: annotation dc su dung de gan gia tri cho mot bien tu cac nguon:
    *  + application.properties/application.yaml
    *  ....
    * */
    @Value("${file.upload-dir}")
    private String uploadDir;

      /*I_0 -  GET ->lay va do du lieu khong phan trang*/
    public ResponseEntity<Map<String, Object>> getAllUser() {
        //khởi tạo biến lưu trữ kết quả trả về
        Map<String, Object> response = new HashMap();

        //b - Yêu câu repository lấy dữ liệu -> gọi đén Repository.mehthod trong crudRepository
        List<User> lsUsers = (List<User>) userRepo.findAll();

        //c - trả về kết quả cho người dùng -> trả theo chuẩn restFullApi
        response.put("data", lsUsers);
        response.put("statuscode", 200);
        response.put("msg", "get dữ liệu thành công");

        return new ResponseEntity(response, HttpStatus.OK);
    }
    
    /*I_1 -  GET ->lay va do du lieu co phan trang*/
    public ResponseEntity<Map<String, Object>> getAllUserPagination(int pageNumber, 
                                                                    int pageSize, 
                                                                    String sortby,
                                                                    String searchTerm){
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

        /* thêm đoạn này xử lý tìm kiếm 
         -> neu nhu không co thuc thi tiem kiem thi hien thi phang trang binh thuong 
         <=> serarch thi bo phan trang tiến hành get all value khi search từ khóa tiềm kiếm
         là name or username
        */
        if(searchTerm == null || searchTerm.isEmpty()){
            pageResult =  userRepo.findAll(pageable);
        }else{
            //co yeu cau tim kiem thi tien hanh xoa phan trang di
            pageResult =  userRepo.findBySearchContains(searchTerm.toLowerCase(),
                                                        searchTerm.toLowerCase(),
                                                        pageable);
        }
        
        if(pageResult.hasContent()){
            //tra ket qua cho nguoi dung -> tra theo chuan restfull APi sieu cap vip pro
            response.put("data", pageResult.getContent());
            response.put("statuscode", 201);
            response.put("msg", "get data success");

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
           response.put("msg", "no data");

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


    /*II - Post(create)*/
    //MultipartFile: la mot interface trong spring, dc su dung de xu ly cac tep files -> dc upload thog qua giao thuc HTTP request
    public ResponseEntity<Map<String, Object>> createUser(UserCreateRequestDTO_AD objCreate, MultipartFile file){
        //a - khoi tao bien response de luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();


        // ### DÙNG BEAN VALIDATION ĐỌC ANNOTATION TRONG DTO --- ####
        Set<ConstraintViolation<UserCreateRequestDTO_AD>> violationsSet = validator.validate(objCreate);
        if (!violationsSet.isEmpty()) {
            // Dùng lại ValidationErrorResponse + Violations mà bạn đã viết
            ValidationErrorResponse responseError = new ValidationErrorResponse();
            for (ConstraintViolation<UserCreateRequestDTO_AD> v : violationsSet) {
                String fieldName = v.getPropertyPath().toString(); // ví dụ: "name", "email"
                String message   = v.getMessage();                 // ví dụ: "khogn dc de name trong"
                responseError.getViolations().add(new Violations(fieldName, message));
            }

            response.put("data", responseError);
            response.put("statuscode", 400);
            response.put("msg", "Data not valid, Please check");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

    
        String newFile = null;

        //thuc hien kiem tra dieu kien chap nhan ruot img rong
        if(file != null && !file.isEmpty()){
            /*******xu ly luu ruot img khi create Use******/
            //tao chuoi randomString  rong ->
            String randomString = "";

            //su dung datetime luu thong tin anh tranh trung ten va thoi gian luu anh
            DateTimeFormatter iso_8601_formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
            randomString = LocalDateTime.now().format(iso_8601_formatter);

            /*thiet lap file path lay dung ten goc o dia luu folder trong project
             * => thg thiet lap file chi dinh url lay: D:\\DOWNLOAD\\img\\....
             * <=> tuy nhien, ntn vd may windown url  D:\\DOWNLOAD\\img\\.... nhung o may mac  D:/DOWNLOAD/img/....
             * nhu vay neu thiet lap code nay o tren may windown thi qua may mac doan code rootFolder nay khong sai
             * nhung ma khac he dieu hanh thi no khong hieu.. viet code nt la viet code co dinh viet code ngu
             * ==-=> lib java.nio.file.Paths;
             * */
            String rootFolder = Paths.get("").toAbsolutePath().toString();

            /*tao duong dan xu ly luu file
             *  + file.getOriginalFilename(); method xu ly ghi nhan lay cai file ruot anh va tien hanh ghi nhan va luu vao trong folder uploads
             *  + file.separator: co nhiem vu chinh la dung de chi dau phan cach thu muc: // cua windown, hay dau \ cua mac
             *  + uploadDir: chinh la ten file lien ket voi cau hinh properties ben file application.properties ban nay
             * */
            newFile = randomString + "_" + file.getOriginalFilename();
            String filePath = rootFolder + File.separator + uploadDir + File.separator + newFile;

            //tien hanh xu ly luu file vao thu muc uploads. Đây là hành động lấy ra một chiếc phong bì mới tinh và viết Địa chỉ Nhà (filePath)
            // lên đó. Chiếc phong bì này chưa chứa bức thư hay ảnh đâu nhé, nó chỉ là tấm bìa ghi địa chỉ thôi!
            File destinationFile = new File(filePath);

            /*tien hanh tao folder uploads trong projects neu no khong ton tai*/
            destinationFile.getParentFile().mkdirs();

            //tien hanh lay ruot anh(anh goc, kich co anh(nhieu mb...)) ghi nhan va luu vao file
            try{
                file.transferTo(destinationFile);
            }catch(IOException e){
                e.printStackTrace();
            }
        }

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
            newEntity.setName(objCreate.getName());
            newEntity.setUsername(objCreate.getUsername());

            //xử ly ma hoa matkhau theo chuan bcrypt
            BCryptPasswordEncoder endCoder = new BCryptPasswordEncoder();
            newEntity.setPassword(endCoder.encode(objCreate.getPassword()));

            // Sử dụng intValue() an toàn bằng cách check null - tránh lỗi NullPointerException
            if (objCreate.getGender() != null) {
                newEntity.setGender(objCreate.getGender().intValue());
            }

            //date can them dk de text neu la null mà ep chuyen thanh localdate la loi ngay
            if (objCreate.getBirthday() != null) {
                newEntity.setBirthday(objCreate.getBirthday());
            }
            newEntity.setEmail(objCreate.getEmail());
        
            //xu ly goi repo luu img co ruot
            if(newFile != null){
                newEntity.setAvatar(newFile);
            }

            newEntity.setPhone(objCreate.getPhone());
            newEntity.setAddress(objCreate.getAddress());

            //lk khoa ngoai cua table salary_level
            newEntity.setLevelId(objCreate.getLevelId());

            // Sử dụng intValue() an toàn bằng cách check null - tránh lỗi NullPointerException
            if (objCreate.getIsActive() != null) {
                newEntity.setIsActive(objCreate.getIsActive().intValue());
            }

           // c-2 yeu cau repository luu lai khoi tao tren
            // thuc hien nhan ten dk username va tien hanh kiem tra tranh trung ten username khi dang ky
           User existingUser = userRepo.findByUsername(objCreate.getUsername());
           // c-3 thuc hien kiem tra ds data trong mysql co trung ten username nao khong
            if(existingUser != null){
                response.put("msg", "The name you registered with already takes a name. Please choose a different name.");
                response.put("statuscode", 400);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }else{
                User createEntity = userRepo.save(newEntity);

                //c-4 tra ve ket qua cho nguoi dung theo chuan restfullAPI
                response.put("data", createEntity);
                response.put("statuscode", 200);
                response.put("msg", " create user success");

                return new ResponseEntity<>(response, HttpStatus.CREATED);
            }
        }else{
            response.put("data", responseError);
            response.put("statuscode", 501);
            response.put("msg", " The data does not meet the requirements and needs to be reviewed.");

            return new ResponseEntity<>(response, HttpStatus.NOT_IMPLEMENTED);
        }
    }


     /*III - Put(Update0*/
   public ResponseEntity<Map<String, Object>> updateUser(Integer id, UserUpdateRequestDTO_AD objEdit, MultipartFile file) {
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
        if (objEdit.getIsActive() != null && objEdit.getLevelId() > 0) {
            entityEdit.setLevelId(objEdit.getLevelId());
        }
        
        if (objEdit.getIsActive() != null) {
            entityEdit.setIsActive(objEdit.getIsActive());
        }

        // Lưu vào DB
        userRepo.save(entityEdit);

        response.put("data", entityEdit);
        response.put("statuscode", 200);
        response.put("msg", "Update user success");
        return new ResponseEntity<>(response, HttpStatus.OK);

    } else {
        response.put("data", null);
        response.put("statuscode", 404);
        response.put("msg", "Update user failed - User ID not foundD");
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
            response.put("msg", "delete User successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve chuan restfull api thong bao la khong ton tai id can xoa
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "Deleted account no longer exists");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


}
