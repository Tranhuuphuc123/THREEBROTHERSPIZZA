package webpizza.com.vn.webapp.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import webpizza.com.vn.webapp.service.admin.ProductMaterialServiceAD;

@RestController
@RequestMapping("/api/admin/product-materials")
public class ProductMaterialControllerAD {

    @Autowired
    private ProductMaterialServiceAD productMaterialServiceAD;

    /* VIEW */
    @GetMapping
    public ResponseEntity<?> getAll() {
        return productMaterialServiceAD.getAll();
    }
}
