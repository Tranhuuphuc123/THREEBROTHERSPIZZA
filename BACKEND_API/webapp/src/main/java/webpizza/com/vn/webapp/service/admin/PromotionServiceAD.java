package webpizza.com.vn.webapp.service.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.DTO.admin.PromotionDTO_AD.PromotionCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.PromotionDTO_AD.PromotionUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Promotion;
import webpizza.com.vn.webapp.repository.PromotionRepository;

@Service
public class PromotionServiceAD {
    @Autowired
    private PromotionRepository promotionRepo;

     /*I _0 - get hien thi khong phan trang */
     public ResponseEntity<Map<String, Object>> getAllPromotion() {
        //khởi tạo biến lưu trữ kết quả trả về
        Map<String, Object> response = new HashMap();

        //b - Yêu câu repository lấy dữ liệu -> gọi đén Repository.mehthod trong crudRepository
        List<Promotion> lsPro = (List<Promotion>) promotionRepo.findAll();

        //c - trả về kết quả cho người dùng -> trả theo chuẩn restFullApi
        response.put("data", lsPro);
        response.put("statuscode", 200);
        response.put("msg", "get value success!");

        return new ResponseEntity(response, HttpStatus.OK);
    }

    /*I_2: trả về danh sách promotion theo id cần tiềm */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<Promotion> optFoundById = promotionRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            Promotion proEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", proEntity);
            response.put("statuscode", 201);
            response.put("msg", "Return id of Promotion success");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            //tra ve ket qua nguoi dung
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "Please seen result search");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


     /*I _3 - get hien thi co phan trang */
    public ResponseEntity<Map<String, Object>> getAllPromotionPagination(int pageNumber, 
                                                                         int pageSize, 
                                                                         String sortBy,
                                                                         String searchTerm){
        //1. khoi tao bien respone luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //1. yeu cau repository lay du dieu - co xu ly phan trang
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(sortBy));
        Page<Promotion> pageResult = promotionRepo.findAll(pageable);

         /* thêm đoạn này xử lý tìm kiếm 
         -> neu nhu không co thuc thi tiem kiem thi hien thi phang trang binh thuong 
         <=> serarch thi bo phan trang tiến hành get all value khi search từ khóa tiềm kiếm
         là name or username
        */
        if(searchTerm == null || searchTerm.isEmpty()){
            pageResult =  promotionRepo.findAll(pageable);
        }else{
            //co yeu cau tim kiem thi tien hanh xoa phan trang di
            pageResult =  promotionRepo.findBySearchContains(searchTerm.toLowerCase(),pageable);
        }

        if(pageResult.hasContent()){
            //tra ve ket qua cho nguoi dung theo chuan restfull api 
            response.put("data", pageResult.getContent());
            response.put("statuscode", 201);
            response.put("msg", "get value success!");

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

 

    /**II - create tao role**/
    public ResponseEntity<Map<String, Object>> createPromotion(PromotionCreateRequestDTO_AD objCreate) {
        Map<String, Object> response = new HashMap<>();

        // 1. Kiểm tra ngày kết thúc
        if (objCreate.getEndDate().isBefore(objCreate.getStartDate())) {
            response.put("msg", "The end date must not be before the start date!!");
            response.put("statuscode", 400);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // 2. Map dữ liệu sang Entity
        Promotion newEntity = new Promotion();
        newEntity.setName(objCreate.getName());
        newEntity.setDiscount(objCreate.getDiscount());
        newEntity.setDescription(objCreate.getDescription());
        newEntity.setStartDate(objCreate.getStartDate());
        newEntity.setEndDate(objCreate.getEndDate());

        // 3. Xử lý isActive: Nếu Postman gửi null, ta mặc định là false
        if (objCreate.getIsActive() != null) {
            newEntity.setIsActive(objCreate.getIsActive());
        } else {
            newEntity.setIsActive(0); // Gán mặc định tại Service thay vì Entity
        }

        // 4. Lưu vào DB
        Promotion createEntity = promotionRepo.save(newEntity);

        // 5. Trả về kết quả
        response.put("data", createEntity);
        response.put("statuscode", 201);
        response.put("msg", "Create Success!");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }



    /**III - update role**/
    public ResponseEntity<Map<String, Object>> updatePromotion(Integer id, PromotionUpdateRequestDTO_AD objUpdate) {
        Map<String, Object> response = new HashMap<>();

        // 1. Tìm kiếm Promotion theo id
        Optional<Promotion> optFound = promotionRepo.findById(id);

        if (optFound.isPresent()) {
            Promotion entityEdit = optFound.get();

            // 2. Cập nhật các trường thông tin cơ bản (Nếu có gửi mới thì mới cập nhật)
            if (objUpdate.getName() != null && !objUpdate.getName().isEmpty()) {
                entityEdit.setName(objUpdate.getName());
            }
            if (objUpdate.getDiscount() != null) {
                entityEdit.setDiscount(objUpdate.getDiscount());
            }
            if (objUpdate.getDescription() != null) {
                entityEdit.setDescription(objUpdate.getDescription());
            }
            if (objUpdate.getStartDate() != null) {
                entityEdit.setStartDate(objUpdate.getStartDate());
            }
            if (objUpdate.getEndDate() != null) {
                entityEdit.setEndDate(objUpdate.getEndDate());
            }

            // 3. Cập nhật trạng thái isActive (Đây là nút gạt thủ công của bạn)
            // Lưu ý: Với boolean, nên kiểm tra null nếu dùng Object Boolean trong DTO
            if (objUpdate.getIsActive() != null){
                   entityEdit.setIsActive(objUpdate.getIsActive());
            }

            // 4. Kiểm tra logic ngày tháng sau khi update (Tránh trường hợp sửa ngày bị lệch)
            if (entityEdit.getEndDate().isBefore(entityEdit.getStartDate())) {
                response.put("msg", "Error: The end date must not be before the start date!!");
                response.put("statuscode", 400);
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }

            // 5. Lưu lại vào DB
            Promotion updatedEntity = promotionRepo.save(entityEdit);

            response.put("data", updatedEntity);
            response.put("statuscode", 200);
            response.put("msg", "Update promotion success!");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("data", null);
            response.put("statuscode", 404);
            response.put("msg", "update failed !");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }



    /**IV - delete xoa role**/
    public ResponseEntity<Map<String, Object>> deletePro(Integer id){
        //tao response luu ket qua tra ve
        Map<String,Object> response = new HashMap<>();

        //tim theo id
        Optional<Promotion> optFound = promotionRepo.findById(id);

        //neu tim thay thi xoa
        if(optFound.isPresent()){
            //lay entity ra khoi hop qua opt
            Promotion deleteEntity = optFound.get();

            //goi repo xoa entity
            promotionRepo.delete(deleteEntity);

            //goi response luu ket qua tra ve
            response.put("data",null);
            response.put("statuscode",200);
            response.put("msg","delete success");

            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            //goi response luu ket qua tra ve
            response.put("data",null);
            response.put("statuscode",404);
            response.put("msg","delete failed");

            return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
        }
    }
}
