package webpizza.com.vn.webapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
} 