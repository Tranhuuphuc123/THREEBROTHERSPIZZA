package webpizza.com.vn.webapp.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.DTO.admin.FeedbackDTO_AD.FeedbackCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.FeedbackDTO_AD.FeedbackUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Feedbacks;
import webpizza.com.vn.webapp.repository.FeedbackRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class FeedbackServiceAD {
    @Autowired
    private FeedbackRepository feedbackRepo;

    /*I _ - get hien thi co phan trang */
    public ResponseEntity<Map<String, Object>> getAllFeedbackPagination(int pageNumber, int pageSize, String sortBy, Number searchTerm){
        //1. khoi tao bien respone luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //1. yeu cau repository lay du dieu - co xu ly phan trang
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(sortBy));
        Page<Feedbacks> pageResult = feedbackRepo.findAll(pageable);

        /* them dieu kien cho chuc nang tim keim
         + khi search thi khong cos phan trang khi hien thi value
         + khong search thi hien thi phan trang binh thuong
        */
       if(searchTerm == null){
        pageResult = feedbackRepo.findAll(pageable);
       }else{
         //co yeu cau tim kiem thi tien hanh xoa phan trang di ma hien  thi value bt
         pageResult = feedbackRepo.findBySearchContains(searchTerm,  
                                                        searchTerm,
                                                        pageable);
       }

        if(pageResult.hasContent()){
            //tra ve ket qua cho nguoi dung theo chuan restfull api 
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
            response.put("msg", "get data failed ! ");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }


    /*I_2: trả về danh sách salary_level theo id cần tiềm */
    public ResponseEntity<Map<String, Object>> getById (Integer id){
        //khoi tao bien luu ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //nho repo thuc thi tra ve ket qua id => luu trong bien Optional(chap nhan gia tri null)
        Optional<Feedbacks> optFoundById = feedbackRepo.findById(id);
        //neu no co ton tai
        if(optFoundById.isPresent()){
            //nhan id vau tim kiem dc
            Feedbacks feedbackEntity = optFoundById.get();

            //tra ve thong bao thanh cong
            response.put("data", feedbackEntity);
            response.put("statuscode", 201);
            response.put("msg", "Return id of Salary Level success");

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
    public ResponseEntity<Map<String, Object>> createFeedback(FeedbackCreateRequestDTO_AD objCreate) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Khởi tạo và gán giá trị Entity
            Feedbacks feedback = new Feedbacks();

            feedback.setProductId(objCreate.getProductId());
            feedback.setUserId(objCreate.getUserId());
            feedback.setRating(objCreate.getRating());
            feedback.setIsActive(objCreate.getIsActive());
            feedback.setMessage(objCreate.getMessage());

            // Lưu vào DB
            Feedbacks createFeedbackEntity = feedbackRepo.save(feedback);

            response.put("data", createFeedbackEntity);
            response.put("statuscode", 200);
            response.put("msg", "Create sucess !");
            return new ResponseEntity<>(response, HttpStatus.CREATED);

        } catch (Exception e) {
            response.put("data", null);
            response.put("statuscode", 500);
            response.put("msg", "wrong database: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    /*III - delete*/
    public ResponseEntity<Map<String, Object>> deleteFeedback(Integer id){
        //tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //phai tim suplier can xoa theo id cua no
        Optional<Feedbacks> optFound = feedbackRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan nhan id do cho trg do dugn tren csdl
            Feedbacks feedbackEntityGetByID = optFound.get();

             //nho repository xoa dat r
            feedbackRepo.delete((feedbackEntityGetByID));

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
    public ResponseEntity<Map<String, Object>> updateFeedback(Integer id, FeedbackUpdateRequestDTO_AD objUpdate){
        //1. tao bien luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //tiem kiem entity theo id
        Optional<Feedbacks> optFound = feedbackRepo.findById(id);

        //neu tim thay id 
        if(optFound.isPresent()){
            //gan id tim thay cho entity
            Feedbacks feedbackEntity = optFound.get();

            /* kiem tra dieu kien update neu khong co gi thi lay gia cu */
            if(objUpdate.getProductId() != null){
                feedbackEntity.setProductId((objUpdate.getProductId()));
            }
            if(objUpdate.getUserId() != null){
                feedbackEntity.setUserId((objUpdate.getUserId()));
            }
            if(objUpdate.getRating() != null){
                feedbackEntity.setRating((objUpdate.getRating()));
            }
            if(objUpdate.getMessage() != null){
                feedbackEntity.setMessage((objUpdate.getMessage()));
            }
            if(objUpdate.getIsActive() != null){
                feedbackEntity.setIsActive((objUpdate.getIsActive()));
            }

            //nho rep update(save lai)
            feedbackRepo.save(feedbackEntity);

            response.put("data",feedbackEntity );
            response.put("statuscode", 200);
            response.put("msg", "update sucess !");

            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("data",null );
            response.put("statuscode", 404);
            response.put("msg", "update failed !");

            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
  
}
