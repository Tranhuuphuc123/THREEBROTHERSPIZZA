package webpizza.com.vn.webapp.service.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import webpizza.com.vn.webapp.repository.SupplierRepository;

@Service
public class SupplierServiceAD {
    @Autowired
    private SupplierRepository supplierRepo;

    @Value("${file.upload-dir}")
    private String uploadDir;
}
