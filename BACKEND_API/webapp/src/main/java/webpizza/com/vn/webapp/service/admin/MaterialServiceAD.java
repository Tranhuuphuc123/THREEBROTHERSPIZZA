package webpizza.com.vn.webapp.service.admin;

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

import webpizza.com.vn.webapp.DTO.admin.MaterialDTO_AD.MaterialCreateRequestDTOAD;
import webpizza.com.vn.webapp.DTO.admin.MaterialDTO_AD.MaterialUpdateRequestDTOAD;
import webpizza.com.vn.webapp.entity.Material;
import webpizza.com.vn.webapp.repository.MaterialRepository;

@Service
public class MaterialServiceAD {

    @Autowired
    private MaterialRepository materialRepo;

    /*tao bien string lay url cau hinh luu file da thiet lap ben application.properties
    * @Value: annotation dc su dung de gan gia tri cho mot bien tu cac nguon:
    *  + application.properties/application.yaml
    *  ....
    * */
    @Value("${file.upload-dir}")
    private String uploadDir;


     /*I_0 -  GET ->lay va do du lieu khong phan trang*/
     public ResponseEntity<Map<String, Object>> getAllMaterial(){
        //khởi tạo biến lưu trữ kết quả trả về
        Map<String, Object> response = new HashMap();

        //b - Yêu câu repository lấy dữ liệu -> gọi đén Repository.mehthod trong crudRepository
        List<Material> lsMaterials = (List<Material>) materialRepo.findAll();

        //c - trả về kết quả cho người dùng -> trả theo chuẩn restFullApi
        response.put("data", lsMaterials);
        response.put("statuscode", 200);
        response.put("msg", "get data success !");

        return new ResponseEntity(response, HttpStatus.OK);
     }

    
    /*I_1 -  GET ->lay va do du lieu co phan trang*/
    public ResponseEntity<Map<String, Object>> getAllMaterialPagination(int pageNumber, 
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
        Page<Material> pageResult = materialRepo.findAll(pageable);

        
        /* them dieu kien cho chuc nang tim keim
        + khi search thi khong cos phan trang khi hien thi value
        + khong search thi hien thi phan trang binh thuong
        */
        if(searchTerm == null || searchTerm.isEmpty()){
            pageResult = materialRepo.findAll(pageable);
        }else{
            //co yeu cau tim kiem thi tien hanh xoa phan trang di ma hien  thi value bt
            pageResult = materialRepo.findBySearchContains(searchTerm.toLowerCase(), pageable);
        }
        
        if(pageResult.hasContent()){
            //tra ket qua cho nguoi dung -> tra theo chuan restfull APi sieu cap vip pro
            response.put("data", pageResult.getContent());
            response.put("statuscode", 201);
            response.put("msg", "get data success !");

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
           response.put("msg", " get data failed !");

           return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    
    /*I_2: trả về danh sách suppliers theo id cần tiềm */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<Material> optFoundById = materialRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            Material materialEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", materialEntity);
            response.put("statuscode", 201);
            response.put("msg", "Return id of Material success");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve ket qua nguoi dung
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "Please seen result search");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }



     /*II - Post(create)*/
    //MultipartFile: la mot interface trong spring, dc su dung de xu ly cac tep files -> dc upload thog qua giao thuc HTTP request
    public ResponseEntity<Map<String, Object>> createMaterial(MaterialCreateRequestDTOAD objCreate, MultipartFile file){
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
            Material newEntity = new Material();

            newEntity.setName(objCreate.getName());
            newEntity.setImg(newFile);
            newEntity.setSupplierId(objCreate.getSupplierId());
            newEntity.setUnit(objCreate.getUnit());
            newEntity.setQuantity(objCreate.getQuantity());
            newEntity.setPrice(objCreate.getPrice());

            if (objCreate.getExpireDate() != null){    
                newEntity.setExpireDate(objCreate.getExpireDate());            
            }            

            //goi repo lưu vao csdl
            Material createMatEntity = materialRepo.save(newEntity);

            response.put("data", createMatEntity);
            response.put("statuscode", 200);
            response.put("msg", "Create material success !");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (Exception e){
            response.put("data", null);
            response.put("statuscode", 500);
            response.put("msg", "Lỗi database: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    /*III - delete*/
    public ResponseEntity<Map<String, Object>> deleteMaterial(Integer id){
        //tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //phai tim suplier can xoa theo id cua no
        Optional<Material> optFound = materialRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan nhan id do cho trg do dugn tren csdl
            Material delMatID = optFound.get();

            /*xu ly tien hanh xoa ruot anh ung voi taikhoan cua anh do*/
            String rootFolder = Paths.get("").toAbsolutePath().toString();
            Path filePath = Path.of(rootFolder + File.separator + uploadDir + File.separator + delMatID.getImg());

            /*tien hanh xoa anh cu neu ton tai*/
             try{
                //tien hanh deleteIfExits co ton tai no moi xoa
                Files.deleteIfExists(filePath);
            }catch (IOException e){
                e.printStackTrace();
            }

            //nho repo thuc hien xoa entity can xoa do
            materialRepo.delete(delMatID);

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
    public ResponseEntity<Map<String, Object>> updateMaterial(Integer id, MaterialUpdateRequestDTOAD objUpdate, MultipartFile file){
        //1. tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //tiem kiem entity theo id
        Optional<Material> optFound = materialRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan id tim thay cho entity
            Material matEntity = optFound.get();

            /* kiem tra dieu kien update neu khong co gi thi lay gia cu */
            if(objUpdate.getName() != null){
                matEntity.setName((objUpdate.getName()));
            }

            //xu ly trg img
            if(file != null){
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
                    if(matEntity.getImg() != null){
                        Path delPath = Paths.get(rootFolder, uploadDir, matEntity.getImg());
                        Files.deleteIfExists(delPath);
                    }

                    matEntity.setImg(newFile);
                }catch(IOException e ){
                    System.err.println("loi xu ly file: " + e.getMessage());
                }
            }
            
            if(objUpdate.getSupplierId() != null){
                matEntity.setSupplierId((objUpdate.getSupplierId()));
            }
            if(objUpdate.getUnit() != null){
                matEntity.setUnit((objUpdate.getUnit()));
            }
            if(objUpdate.getQuantity() != null){
                matEntity.setQuantity((objUpdate.getQuantity()));
            }
            if(objUpdate.getPrice() != null){
                matEntity.setPrice((objUpdate.getPrice()));
            }
            if(objUpdate.getExpireDate() != null){
                matEntity.setExpireDate((objUpdate.getExpireDate()));
            }

            //nho rep update(save lai)
            materialRepo.save(matEntity);

            response.put("data",matEntity );
            response.put("statuscode", 200);
            response.put("msg", "update material success!");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("data",null );
            response.put("statuscode", 404);
            response.put("msg", "update material failed !");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

}
