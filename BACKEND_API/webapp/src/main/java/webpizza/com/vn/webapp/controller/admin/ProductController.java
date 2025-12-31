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

import webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD.ProductCreateRequestDTOAD;
import webpizza.com.vn.webapp.DTO.admin.ProductDTO_AD.ProductUpdateRequestDTOAD;
import webpizza.com.vn.webapp.service.admin.ProductServiceAD;

@RestController
@RequestMapping("/api/admin/products")
public class ProductController {
    @Autowired
    private ProductServiceAD productServiceAD;

    /* I _  get */

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSupIndex(@RequestParam(defaultValue = "1") Integer pageNumber,
                                                           @RequestParam(defaultValue = "3") Integer pageSize,
                                                           @RequestParam(defaultValue = "id") String sortBy){
        //goi service thuc thi method  getall
        return productServiceAD.getAllProductPagination(pageNumber,pageSize, sortBy);                                                         
    }

     /* II - create */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPro (@RequestParam("file") MultipartFile file,
                                                         @RequestParam("data") String jsonData){
        //khoi tao lop ObjectMapper de map json(param:data)  -> parse(chuyen) json data thanh value trong dto -> day len entity luu vao csdl
        ObjectMapper objectMapper = new ObjectMapper();
        
        //khoi tao dto
        ProductCreateRequestDTOAD objDTO = null;

        //tien hanh cho dto doc va ghi nhan data  tu json gui len map thogn qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, ProductCreateRequestDTOAD.class);
        }catch(Exception e){
            e.printStackTrace();
        }

        return productServiceAD.createProduct(objDTO, file);
    }

     /*III - delete */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Map<String, Object>> deletePro(@PathVariable Integer id){
        return productServiceAD.deleteProduct(id);
    }


    /*IV - update */
    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateSup(@PathVariable Integer id,
                                                        @RequestParam(value = "file", required = false) MultipartFile file,
                                                         @RequestParam("data") String jsonData){
        //khoi tao lop ObjectMapper de map json(param:data)  -> parse(chuyen) json data thanh value trong dto -> day len entity luu vao csdl
        ObjectMapper objectMapper = new ObjectMapper();

         //khoi tao dto
        ProductUpdateRequestDTOAD objDTO = null;

         //tien hanh cho dto doc va ghi nhan data  tu json gui len map thogn qua lop ObjectMapper
        try{
            objDTO = objectMapper.readValue(jsonData, ProductUpdateRequestDTOAD.class);
        }catch(Exception e){
            e.printStackTrace();
        }

        return productServiceAD.updateProduct(id, objDTO, file);
    }
}
