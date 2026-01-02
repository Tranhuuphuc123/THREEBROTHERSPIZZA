package webpizza.com.vn.webapp.service.admin;

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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import webpizza.com.vn.webapp.DTO.admin.SupplierDTO_AD.SupplierCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.SupplierDTO_AD.SupplierUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Supplier;
import webpizza.com.vn.webapp.repository.SupplierRepository;

@Service
public class SupplierServiceAD {

    @Autowired
    private SupplierRepository supplierRepo;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /*I _ - get hien thi co phan trang */
    public ResponseEntity<Map<String, Object>> getAllSupplierPagination(int pageNumber, int pageSize, String sortBy){
        //1. khoi tao bien respone luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //1. yeu cau repository lay du dieu - co xu ly phan trang
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(sortBy));
        Page<Supplier> pageResult = supplierRepo.findAll(pageable);

        if(pageResult.hasContent()){
            //tra ve ket qua cho nguoi dung theo chuan restfull api 
            response.put("data", pageResult.getContent());
            response.put("statuscode", 201);
            response.put("msg", "get du lieu thanh cong oh yeah da qua xa da");

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
            response.put("msg", "la du lieu khong co ");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


    /*I_2: trả về danh sách suppliers theo id cần tiềm */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<Supplier> optFoundById = supplierRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            Supplier supllierEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", supllierEntity);
            response.put("statuscode", 201);
            response.put("msg", "Return id of Supplier success");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve ket qua nguoi dung
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "Please seen result search");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


    /*II - create */
    public ResponseEntity<Map<String, Object>> createSupplier(SupplierCreateRequestDTO_AD objCreate, MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        String newFile = null;

        if (file != null && !file.isEmpty()) {
            try {
                // 1. Lấy tên file an toàn
                String iso_8601 = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                newFile = iso_8601 + "_" + file.getOriginalFilename();

                // 2. Thiết lập đường dẫn lưu trữ (Dùng Path cho hiện đại và chính xác)
                String rootFolder = System.getProperty("user.dir"); // Lấy thư mục gốc project
                Path uploadPath = Paths.get(rootFolder, uploadDir); // Nối với biến uploadDir (ví dụ: "uploads")

                // 3. Tạo thư mục nếu chưa tồn tại
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // 4. Đường dẫn đầy đủ của file ảnh
                Path filePath = uploadPath.resolve(newFile);

                // 5. Ghi "ruột ảnh" xuống ổ đĩa
                file.transferTo(filePath.toFile());

            } catch (IOException e) {
                e.printStackTrace();
                response.put("msg", "Lỗi khi lưu file: " + e.getMessage());
                return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        try {
            // Khởi tạo và gán giá trị Entity
            Supplier sup = new Supplier();
            sup.setCode(objCreate.getCode());
            sup.setName(objCreate.getName());
            sup.setImg(newFile);
            sup.setPhone(objCreate.getPhone());
            sup.setAddress(objCreate.getAddress());
            sup.setDescription(objCreate.getDescription());

            // Lưu vào DB
            Supplier createSupEntity = supplierRepo.save(sup);

            response.put("data", createSupEntity);
            response.put("statuscode", 200);
            response.put("msg", "Create thành công");
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            response.put("data", null);
            response.put("statuscode", 500);
            response.put("msg", "Lỗi database: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /*III - delete*/
    public ResponseEntity<Map<String, Object>> deleteSupplier(Integer id){
        //tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //phai tim suplier can xoa theo id cua no
        Optional<Supplier> optFound = supplierRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan nhan id do cho trg do dugn tren csdl
            Supplier supEntityGetByID = optFound.get();

            /*xu ly tien hanh xoa ruot anh ung voi taikhoan cua anh do*/
            String rootFolder = Paths.get("").toAbsolutePath().toString();
            Path filePath = Path.of(rootFolder + File.separator + uploadDir + File.separator + supEntityGetByID.getImg());

            /*tien hanh xoa anh cu neu ton tai*/
             try{
                //tien hanh deleteIfExits co ton tai no moi xoa
                Files.deleteIfExists(filePath);
            }catch (IOException e){
                e.printStackTrace();
            }

             //nho repository xoa dat r
            supplierRepo.delete((supEntityGetByID));

            //tra ve thong bao chuan restfull api
            response.put("data",null );
            response.put("statuscode", 200);
            response.put("msg", "delete success");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("data",null );
            response.put("statuscode", 404);
            response.put("msg", "delete not success");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


    /* IV_ UPDATE */
    public ResponseEntity<Map<String, Object>> updateSupplier(Integer id, SupplierUpdateRequestDTO_AD objUpdate, MultipartFile file){
        //1. tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //tiem kiem entity theo id
        Optional<Supplier> optFound = supplierRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan id tim thay cho entity
            Supplier supEntity = optFound.get();

            /* kiem tra dieu kien update neu khong co gi thi lay gia cu */
            if(objUpdate.getCode() != null){
                supEntity.setCode((objUpdate.getCode()));
            }
            if(objUpdate.getName() != null){
                supEntity.setName((objUpdate.getName()));
            }
            if(objUpdate.getName() != null){
                supEntity.setName((objUpdate.getName()));
            }

            //xu ly trg img
            if(file != null && !file.isEmpty()){
                try{
                    //su dung datetime luu ten anh theo gio phut giay + ten img: tranh bi trung lap
                    String randomString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                    //tiet lap file path lay dung ten goc o dia luu folder trong project
                    String rootFolder = Paths.get("").toAbsolutePath().toString();
                    //tao duong dan xu ly luu file
                    String newFile = randomString + "_" + file.getOriginalFilename();
                    String filePath = rootFolder + File.separator + uploadDir + File.separator + newFile;

                    //tien hanh lay ruot anh
                    File destinatinFile = new File(filePath);
                    //tien hanh tao folder uploads trong project neu no khong ton tai
                    destinatinFile.getParentFile().mkdirs();
                    file.transferTo(destinatinFile);

                    //xoa anh cu(chi xoa neu ten anh cu ton tai)
                    if(supEntity.getImg() != null && !supEntity.getImg().isEmpty()){
                        Path delPath = Paths.get(rootFolder, uploadDir, supEntity.getImg());
                        Files.deleteIfExists(delPath);
                    }

                    supEntity.setImg(newFile);
                }catch(IOException e ){
                    System.err.println("loi xu ly file: " + e.getMessage());
                }
            }

            if(objUpdate.getPhone() != null){
                supEntity.setPhone((objUpdate.getPhone()));
            }
            if(objUpdate.getAddress() != null){
                supEntity.setAddress((objUpdate.getAddress()));
            }
            if(objUpdate.getDescription() != null){
                supEntity.setDescription((objUpdate.getDescription()));
            }

            //nho rep update(save lai)
            supplierRepo.save(supEntity);

            response.put("data",supEntity );
            response.put("statuscode", 200);
            response.put("msg", "update thanh cong");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("data",null );
            response.put("statuscode", 404);
            response.put("msg", "update khong thanh cong");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}
