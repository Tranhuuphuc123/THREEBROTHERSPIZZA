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

import webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD.ProductCreateRequestDTOAD;
import webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD.ProductUpdateRequestDTOAD;
import webpizza.com.vn.webapp.entity.Product;
import webpizza.com.vn.webapp.repository.ProductRepository;

@Service
public class ProductServiceAD {
    
    @Autowired
    private ProductRepository productRepo;

    /*tao bien string lay url cau hinh luu file da thiet lap ben application.properties
    * @Value: annotation dc su dung de gan gia tri cho mot bien tu cac nguon:
    *  + application.properties/application.yaml
    *  ....
    * */
    @Value("${file.upload-dir}")
    private String uploadDir;


    
    /*I_1 -  GET ->lay va do du lieu co phan trang*/
    public ResponseEntity<Map<String, Object>> getAllProductPagination(int pageNumber, int pageSize, String sortby){
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
        Page<Product> pageResult = productRepo.findAll(pageable);
        
        if(pageResult.hasContent()){
            //tra ket qua cho nguoi dung -> tra theo chuan restfull APi sieu cap vip pro
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
           response.put("msg", " la du lieu khong co hu hu hu hu");

           return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


     /*II - Post(create)*/
    //MultipartFile: la mot interface trong spring, dc su dung de xu ly cac tep files -> dc upload thog qua giao thuc HTTP request
    public ResponseEntity<Map<String, Object>> createProduct(ProductCreateRequestDTOAD objCreate, MultipartFile file){
        //a - khoi tao bien response de luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

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


        //c - tiến hành khởi tạo product create
        try{
            //c-1 khoi tao ProductEntity
            Product newEntity = new Product();

            newEntity.setCode(objCreate.getCode());
            newEntity.setName(objCreate.getName());
            newEntity.setImage(newFile);
            newEntity.setShortDescription(objCreate.getShortDescription());
            newEntity.setDescription(objCreate.getDescription());
            newEntity.setPrice(objCreate.getPrice());
            newEntity.setQuantity(objCreate.getQuantity());

            // Sử dụng intValue() an toàn bằng cách check null - tránh lỗi NullPointerException
            if (objCreate.getIsActive() != null) {
                newEntity.setIsActive(objCreate.getIsActive().intValue());
            }

            newEntity.setCategoryIid(objCreate.getCategoryId());

            //goi repo lưu vao csdl
            Product createProEntity = productRepo.save(newEntity);

            response.put("data", createProEntity);
            response.put("statuscode", 200);
            response.put("msg", "Create thành công");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (Exception e){
            response.put("data", null);
            response.put("statuscode", 500);
            response.put("msg", "Lỗi database: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*III - delete*/
    public ResponseEntity<Map<String, Object>> deleteProduct(Integer id){
        //tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //phai tim suplier can xoa theo id cua no
        Optional<Product> optFound = productRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan nhan id do cho trg do dugn tren csdl
            Product delProID = optFound.get();

            //nho repo thuc hien xoa entity can xoa do
            productRepo.delete(delProID);

            //tra ve thong bao chuan restfull api
            response.put("data",null );
            response.put("statuscode", 200);
            response.put("msg", "delete thanh cong");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("data",null );
            response.put("statuscode", 404);
            response.put("msg", "delete khong thanh cong");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


    /* IV_ UPDATE */
    public ResponseEntity<Map<String, Object>> updateProduct(Integer id, ProductUpdateRequestDTOAD objUpdate, MultipartFile file){
        //1. tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //tiem kiem entity theo id
        Optional<Product> optFound = productRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan id tim thay cho entity
            Product proEntity = optFound.get();

            /* kiem tra dieu kien update neu khong co gi thi lay gia cu */
            if(objUpdate.getCode() != null){
                proEntity.setCode((objUpdate.getCode()));
            }
            if(objUpdate.getName() != null){
                proEntity.setName((objUpdate.getName()));
            }

            //xu ly trg img
            if(file != null){
                try{
                    //su dung datetime luu ten anh theo gio phut giay + ten img: tranh bi trung lap
                    String randomString = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
                    //tiet lap file path lay dung ten goc o dia luu folder trong project
                    String rootFolder = Paths.get("null").toAbsolutePath().toString();
                    //tao duong dan xu ly luu file
                    String newFile = randomString + "_" + file.getOriginalFilename();
                    String filePath = rootFolder + File.separator + uploadDir + File.separator + newFile;

                    //tien hanh lay ruot anh
                    File destinatinFile = new File(filePath);
                    //tien hanh tao folder uploads trong project neu no khong ton tai
                    destinatinFile.getParentFile().mkdirs();
                    file.transferTo(destinatinFile);

                    //xoa anh cu(chi xoa neu ten anh cu ton tai)
                    if(proEntity.getImage() != null){
                        Path delPath = Paths.get(rootFolder, uploadDir, proEntity.getImage());
                        Files.deleteIfExists(delPath);
                    }

                    proEntity.setImage(newFile);
                }catch(IOException e ){
                    System.err.println("loi xu ly file: " + e.getMessage());
                }
            }
            
            if(objUpdate.getShortDescription() != null){
                proEntity.setShortDescription((objUpdate.getShortDescription()));
            }
            if(objUpdate.getDescription() != null){
                proEntity.setDescription((objUpdate.getDescription()));
            }
            if(objUpdate.getPrice() != null){
                proEntity.setPrice((objUpdate.getPrice()));
            }
            if(objUpdate.getQuantity() != null){
                proEntity.setQuantity((objUpdate.getQuantity()));
            }
            if(objUpdate.getIsActive() != null){
                proEntity.setIsActive((objUpdate.getIsActive()));
            }
            if(objUpdate.getCategoryId() != null){
                proEntity.setCategoryIid((objUpdate.getCategoryId()));
            }

            //nho rep update(save lai)
            productRepo.save(proEntity);

            response.put("data",proEntity );
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
