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

import webpizza.com.vn.webapp.DTO.admin.CategoryDTO_AD.CategoryCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.CategoryDTO_AD.CategoryUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.RoleDTO_AD.RoleCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.RoleDTO_AD.RoleUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.entity.Category;
import webpizza.com.vn.webapp.entity.Role;
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
            response.put("msg", "get data success!");

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


     //create tao role
    public ResponseEntity<Map<String, Object>> createCategory(CategoryCreateRequestDTO_AD objCreate){
        //tạo response luu kq tra ve
        Map<String, Object> response = new HashMap<>();

        //chuyen dto thanh entity
        Category newEntity = new Category();

        newEntity.setCode(objCreate.getCode());
        newEntity.setName(objCreate.getName());
        newEntity.setDescription(objCreate.getDescription());

        //nhờ repo luu lại vào db
        Category createEntity = categoryRepo.save(newEntity);

        //c-4 tra ve ket qua cho nguoi dung theo chuan restfullAPI
        response.put("data",createEntity);
        response.put("statuscode",200);
        response.put("msg","create  category success !");

        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }

    //update role
    public ResponseEntity<Map<String, Object>> updateCategory(Integer id,CategoryUpdateRequestDTO_AD objUpdate){
        //tao response luu kq tra ve
        Map<String, Object> response = new HashMap<>();

        //tim kiem update theo id
        Optional<Category> optFound = categoryRepo.findById(id);

        //neu tim thay thi cap nhat ko thi thong bao 404
        if(optFound.isPresent()){
            //lay entity ra khoi hop qua opt
            Category entityEdit = optFound.get();

            //kiem tra va cap nha cac truong tt null hoawc empty -> tien hanh bo qua va ghi nhan
            if(objUpdate.getCode() != null && !objUpdate.getCode().isEmpty()){
                entityEdit.setCode(objUpdate.getCode());
            }
            if(objUpdate.getName() != null && !objUpdate.getName().isEmpty()){
                entityEdit.setName(objUpdate.getName());
            }
            if(objUpdate.getDescription() != null && !objUpdate.getDescription().isEmpty()){
                entityEdit.setDescription(objUpdate.getDescription());
            }

            //goi repoluu lai cap nhat
            Category updatedEntity = categoryRepo.save(entityEdit);

            //goi response tra ve ket qua
            response.put("data",updatedEntity);
            response.put("statuscode",200);
            response.put("msg","update category success!");

            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            //goi response tra ve ket qua
            response.put("data",null);
            response.put("statuscode",404);
            response.put("msg","update category failed!");

            return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
        }
    }

    //delete xoa role
    public ResponseEntity<Map<String, Object>> deleteCategory(Integer id){
        //tao response luu ket qua tra ve
        Map<String,Object> response = new HashMap<>();

        //tim theo id
        Optional<Category> optFound = categoryRepo.findById(id);

        //neu tim thay thi xoa
        if(optFound.isPresent()){
            //lay entity ra khoi hop qua opt
            Category deleteEntity = optFound.get();

            //goi repo xoa entity
            categoryRepo.delete(deleteEntity);

            //goi response luu ket qua tra ve
            response.put("data",null);
            response.put("statuscode",200);
            response.put("msg","delete success !");

            return new ResponseEntity<>(response,HttpStatus.OK);
        }else{
            //goi response luu ket qua tra ve
            response.put("data",null);
            response.put("statuscode",404);
            response.put("msg","delete failed !");

            return new ResponseEntity<>(response,HttpStatus.NOT_FOUND);
        }
    }

}
