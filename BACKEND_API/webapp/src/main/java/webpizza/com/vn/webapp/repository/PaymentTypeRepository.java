package webpizza.com.vn.webapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.PaymentTypes;

@Repository
public interface PaymentTypeRepository  extends JpaRepository<PaymentTypes, Integer>{

}