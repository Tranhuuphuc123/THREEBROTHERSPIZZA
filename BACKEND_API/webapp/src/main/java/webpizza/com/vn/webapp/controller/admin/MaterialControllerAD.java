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

import webpizza.com.vn.webapp.DTO.admin.MaterialDTO_AD.MaterialCreateRequestDTOAD;
import webpizza.com.vn.webapp.DTO.admin.MaterialDTO_AD.MaterialUpdateRequestDTOAD;
import webpizza.com.vn.webapp.service.admin.MaterialServiceAD;

@RestController
@RequestMapping("/api/admin/materials")
public class MaterialControllerAD {

    //tiem phu thuoc autowired UserService vao
    @Autowired
    private MaterialServiceAD materialServiceAD;


    /*************1-1: getall không phân trang**********************/
    @GetMapping("/listMaterials")
    public ResponseEntity<Map<String, Object>> getAlls(){
    //gọi đến service thực hiện truy vấn CRUD - cụ thể là getAll dữ liệu mà mình viết logic bên đó
        return  materialServiceAD.getAllMaterial();
    }


    /*************1-1 getall**********************/
    /*  @CrossOrigin(origins = "http://localhost:3000": cho phép localhost 8080 chấp nhận
    chay localhost 3000 khi localhost 8080 đang chay
    * */
    //@CrossOrigin(origins = "http://localhost:3000") 
    @GetMapping
    public ResponseEntity<Map<String, Object>> index(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                     @RequestParam(defaultValue = "3") Integer pageSize,
                                                     @RequestParam(defaultValue = "id") String sortBy){
        // goi service thuc hien truy van hien thi tat ca thong tin cua table user co phan trang
        return materialServiceAD.getAllMaterialPagination(pageNumber, pageSize, sortBy);
    }

    
    /***************** 1-2: getById *******************/
    //@CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Integer id){
        //yeu cau service tra  ve id
        return materialServiceAD.getById(id);
    }



    /*****************-2 create**************************/
    //@CrossOrigin(origins = "http://localhost:3000") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestParam("file") MultipartFile file,
                                                      @RequestParam("data") String jsonData){
        //goij class ObjeMapper de mapp json(param:data) -> parse(chuyen) json thanh valu trong dto -> day len entity user
        ObjectMapper objectMapper = new ObjectMapper();

        //goi khoi  tao lop dto userDTO
        MaterialCreateRequestDTOAD objDTO = null;

        //tien hanh cho dto doc vaf ghi nhan data tu json dui len map thong qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, MaterialCreateRequestDTOAD.class);
        }catch (Exception e){
            e.printStackTrace();
        }
        return materialServiceAD.createMaterial(objDTO, file);
    }



   /********************3 - delete**********************************/
   //@CrossOrigin(origins = "http://localhost:3000") 
   @DeleteMapping("/delete/{id}")
   public ResponseEntity<Map<String, Object>> delete(@PathVariable Integer id){
       return materialServiceAD.deleteMaterial(id);
   }


   /*********************4- update**************************************/
   //@CrossOrigin(origins = "http://localhost:3000") 
   @PutMapping("/update/{id}")
   public ResponseEntity<Map<String, Object>> update(@PathVariable Integer id,
                                                     @RequestParam(value = "file", required = false) MultipartFile file,
                                                     @RequestParam("data") String jsonData){
       //goi class ObjectMapper de mapp json(data) gui len -> parse chuyen json do thanh value va xu ly luu csdl trong table user
       ObjectMapper objectMapper = new ObjectMapper();

       //goi khoi tao lop dto cua UserDTO
       MaterialUpdateRequestDTOAD objDTO = null;

       //tien hanh cho dto doc vaf ghi nhan valuetu json gui len da dc map thong qua lop chuyen ObjectMapper
       try{
           objDTO = objectMapper.readValue(jsonData, MaterialUpdateRequestDTOAD.class);
       } catch (Exception e) {
           throw new RuntimeException(e);
       }

       return materialServiceAD.updateMaterial(id, objDTO, file);
   }
}
