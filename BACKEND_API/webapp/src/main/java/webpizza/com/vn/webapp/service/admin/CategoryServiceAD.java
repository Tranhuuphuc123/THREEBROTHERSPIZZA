package webpizza.com.vn.webapp.service.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.entity.Category;
import webpizza.com.vn.webapp.repository.CategoryRepository;

@Service
public class CategoryServiceAD {
    @Autowired
    private CategoryRepository categoryRepo;

     /*I _0 - get hien thi không phan trang */
     public ResponseEntity<Map<String, Object>> getAllCategory(){
        //khởi tạo biến lưu trữ kết quả trả về
        Map<String, Object> response = new HashMap();

        //b - Yêu câu repository lấy dữ liệu -> gọi đén Repository.mehthod trong crudRepository
        List<Category> lsCat = (List<Category>) categoryRepo.findAll();

        //c - trả về kết quả cho người dùng -> trả theo chuẩn restFullApi
        response.put("data", lsCat);
        response.put("statuscode", 200);
        response.put("msg", "get all category success!");

        return new ResponseEntity(response, HttpStatus.OK);
     }

     /*I _1 - get hien thi co phan trang */
    public ResponseEntity<Map<String, Object>> getAllCategoryPagination(int pageNumber, int pageSize, String sortBy){
        //1. khoi tao bien respone luu tru ket qua tra ve
        Map<String, Object> response = new HashMap<>();

        //1. yeu cau repository lay du dieu - co xu ly phan trang
        Pageable pageable = PageRequest.of(pageNumber-1, pageSize, Sort.by(sortBy));
        Page<Category> pageResult = categoryRepo.findAll(pageable);

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
}
