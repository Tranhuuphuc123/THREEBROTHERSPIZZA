package webpizza.com.vn.webapp.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import webpizza.com.vn.webapp.DTO.admin.ShiftDTO_AD.ShiftCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.ShiftDTO_AD.ShiftUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Shifts;
import webpizza.com.vn.webapp.repository.ShiftRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class ShiftServiceAD {
    @Autowired
    private ShiftRepository shiftRepo;

    /*I _ - get hien thi co phan trang */
    public ResponseEntity<Map<String, Object>> getAllShiftPagination(int pageNumber, int pageSize, String sortBy, String searchTerm){
        //1. khoi tao bien respone luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //1. yeu cau repository lay du dieu - co xu ly phan trang
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(sortBy));
        Page<Shifts> pageResult = shiftRepo.findAll(pageable);

        /* them dieu kien cho chuc nang tim keim
         + khi search thi khong cos phan trang khi hien thi value
         + khong search thi hien thi phan trang binh thuong
        */
       if(searchTerm == null || searchTerm.isEmpty()){
        pageResult = shiftRepo.findAll(pageable);
       }else{
         //co yeu cau tim kiem thi tien hanh xoa phan trang di ma hien  thi value bt
         pageResult = shiftRepo.findBySearchContains(searchTerm.toLowerCase(),  
                                                        pageable);
       }

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


    /*I_2: trả về danh sách shift theo id cần tiềm */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<Shifts> optFoundById = shiftRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            Shifts shiftEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", shiftEntity);
            response.put("statuscode", 201);
            response.put("msg", "Return id of Shift success");

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
    public ResponseEntity<Map<String, Object>> createShift(ShiftCreateRequestDTO_AD objCreate) {
        Map<String, Object> response = new HashMap<>();
  
        try {
            // Khởi tạo và gán giá trị Entity
            Shifts shift = new Shifts();
            shift.setShiftName(objCreate.getShiftName());
            // sup.setImg(newFile);
            shift.setStartTime(objCreate.getStartTime());
            shift.setEndTime(objCreate.getEndTime());
            shift.setWageMultiplier(objCreate.getWageMultiplier());
            shift.setBonus(objCreate.getBonus());

            // Lưu vào DB
            Shifts createShiftEntity = shiftRepo.save(shift);

            response.put("data", createShiftEntity);
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
    public ResponseEntity<Map<String, Object>> deleteShift(Integer id){
        //tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //phai tim suplier can xoa theo id cua no
        Optional<Shifts> optFound = shiftRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan nhan id do cho trg do dugn tren csdl
            Shifts shiftEntityGetByID = optFound.get();

            //nho repository xoa dat r
            shiftRepo.delete((shiftEntityGetByID));

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
    public ResponseEntity<Map<String, Object>> updateShift(Integer id, ShiftUpdateRequestDTO_AD objUpdate){
        //1. tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //tiem kiem entity theo id
        Optional<Shifts> optFound = shiftRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan id tim thay cho entity
            Shifts shiftEntity = optFound.get();

            /* kiem tra dieu kien update neu khong co gi thi lay gia cu */
            if(objUpdate.getShiftName() != null){
                shiftEntity.setShiftName(objUpdate.getShiftName());
            }
            if(objUpdate.getStartTime() != null){
                shiftEntity.setStartTime((objUpdate.getStartTime()));
            }
            if(objUpdate.getEndTime() != null){
                shiftEntity.setEndTime((objUpdate.getEndTime()));
            }
            if(objUpdate.getWageMultiplier() != 0){
                shiftEntity.setWageMultiplier((objUpdate.getWageMultiplier()));
            }
            if(objUpdate.getBonus() != 0){
                shiftEntity.setBonus(objUpdate.getBonus());
            }

            //nho rep update(save lai)
            shiftRepo.save(shiftEntity);

            response.put("data",shiftEntity );
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
