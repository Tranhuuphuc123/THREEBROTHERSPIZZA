package webpizza.com.vn.webapp.controller.admin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import webpizza.com.vn.webapp.DTO.admin.CategoryDTO_AD.CategoryCreateRequestDTO_AD;
import webpizza.com.vn.webapp.DTO.admin.CategoryDTO_AD.CategoryUpdateRequestDTO_AD;
import webpizza.com.vn.webapp.service.admin.CategoryServiceAD;

@RestController
@RequestMapping("/api/admin/categories")
public class CategoryControllerAD {
    @Autowired
    private CategoryServiceAD categoryServiceAD;

    /* I _ 0 get khong phân trang */
    @GetMapping("/listCat")
    public ResponseEntity<Map<String, Object>> getAllCat(){
        //gọi service
        return categoryServiceAD.getAllCategory();
    }

     /* I _ 1 get */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCatPagination(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                           @RequestParam(defaultValue = "3") Integer pageSize,
                                                           @RequestParam(defaultValue = "id") String sortBy){
        //goi service thuc thi method  getall
        return categoryServiceAD.getAllCategoryPagination(pageNumber,pageSize, sortBy);                                                         
    }

     //create permission
     //@CrossOrigin(origins = "${client.url}") 
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody CategoryCreateRequestDTO_AD objCreate){
        try{
            return categoryServiceAD.createCategory(objCreate);
        }catch(Exception ex){
            Map<String, Object> response = new HashMap<>();

            response.put("data", ex.getMessage());
            response.put("statuscode",500);
            response.put("msg","have wrong, please seen again!");

            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //update pẻmission
     //@CrossOrigin(origins = "${client.url}") 
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable(value = "id") Integer id,
                                                     @RequestBody CategoryUpdateRequestDTO_AD objUpdate){
        return categoryServiceAD.updateCategory(id, objUpdate);
    }

    //delete permission
    //@CrossOrigin(origins = "${client.url}") 
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable(value = "id") Integer id){
        return categoryServiceAD.deleteCategory(id);
    }
}
