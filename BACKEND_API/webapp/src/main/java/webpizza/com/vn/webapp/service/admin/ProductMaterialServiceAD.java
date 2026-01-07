package webpizza.com.vn.webapp.service.admin;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.repository.ProductMaterialRepository;

@Service
public class ProductMaterialServiceAD {

    @Autowired
    private ProductMaterialRepository productMaterialRepo;

    /* I - get all */
    public ResponseEntity<Map<String, Object>> getAll() {
        Map<String, Object> response = new HashMap<>();
        response.put("statuscode", 200);
        response.put("data", productMaterialRepo.findAll());
        return ResponseEntity.ok(response);
    }

}
