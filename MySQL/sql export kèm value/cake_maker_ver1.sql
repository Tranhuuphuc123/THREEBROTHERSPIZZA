CREATE DATABASE  IF NOT EXISTS `cake_maker` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cake_maker`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: cake_maker
-- ------------------------------------------------------
-- Server version	8.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'cat001','Pan Crust','This is the signature crust of Pizza Hut, baked in a deep pan, with a crispy edge and a fluffy interior.'),(2,'cat002','Hand-Tossed','This type of sole is hand-kneaded, has a moderate thickness, and is softer and more durable than Pan.'),(3,'cat003','No  Type',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `user_id` int unsigned NOT NULL,
  `rating` int DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` text COLLATE utf8mb4_unicode_ci,
  `supplier_id` int unsigned NOT NULL,
  `unit` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int DEFAULT NULL,
  `price` float DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `materials_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guard_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `module_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'user_view','user manage can view','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Account Manage'),(2,'user_create','user manage can create','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Account Manage'),(3,'user_update','user manage can update','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Account Manage'),(4,'user_delete','user manage can delete','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Account Manage'),(5,'role_view','role manage can view','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Roles Manage'),(6,'role_create','role manage can create','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Roles Manage'),(7,'role_update','role manage can update','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Roles Manage'),(8,'role_delete','role manage can delete','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Roles Manage'),(9,'permission_view','permission manage can view','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Permission Manage'),(10,'permission_create','permission manage can create','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Permission Manage'),(11,'permission_update','permission manage can update','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Permission Manage'),(12,'permission_delete','permission manage can delete','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Permission Manage'),(13,'product_view','product manage can view','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Product Manage'),(14,'product_create','product manage can create','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Product Manage'),(15,'product_update','product manage can update','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Product Manage'),(16,'product_delete','product manage can delete','web','2025-12-20 15:12:17','2025-12-20 15:12:17','Product Manage'),(17,'users_roles_view','user_roles manage can view','web',NULL,NULL,'Authorization Users_Roles Manage'),(18,'roles_permissions_view','roles_per manage can view','web',NULL,NULL,'Authorization Roles_Pers  Manage'),(19,'supplier_view','supplier manage can view','web',NULL,NULL,'supplier manage'),(20,'supplier_create','supplier manage can create','web',NULL,NULL,'supplier manage'),(21,'supplier_edit','supplier manage can edit','web',NULL,NULL,'supplier manage'),(22,'supplier_delete','supplier manage can delete','web',NULL,NULL,'supplier manage'),(23,'promotion_view','promotion manage can view','web',NULL,NULL,'promotion manage'),(24,'promotion_create','promotion manage can create ','web',NULL,NULL,'promotion manage'),(25,'promotion_edit','promotion manage can edit ','web',NULL,NULL,'promotion manage'),(26,'promotion_delete','promotion manage can delete','web',NULL,NULL,'promotion manage'),(49,'material_view','material manage can view','web',NULL,NULL,'material manage'),(50,'material_create','material manage can create','web',NULL,NULL,'material manage'),(51,'material_edit','material manage can edit','web',NULL,NULL,'material manage'),(52,'material_delete','material manage can delete','web',NULL,NULL,'material manage'),(53,'category_view','category manage can view','web',NULL,NULL,'category manage'),(54,'category_create','category manage can create','web',NULL,NULL,'category manage'),(55,'category_edit','category manage can edt','web',NULL,NULL,'category manage'),(56,'category_delete','category manage can delete','web',NULL,NULL,'category manage'),(57,'product_material_view','productMaterial manage can view','web',NULL,NULL,'product_material manage'),(58,'product_material_create','productMaterial manage can create','web',NULL,NULL,'product_material manage'),(59,'product_material_edit','productMaterial manage can edit','web',NULL,NULL,'product_material manage'),(60,'product_material_delete','productMaterial manage can delete','web',NULL,NULL,'product_material manage');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `images` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_material`
--

DROP TABLE IF EXISTS `product_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_material` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int unsigned NOT NULL,
  `material_id` int unsigned NOT NULL,
  `unit` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `standard_price` float NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `material_id` (`material_id`),
  CONSTRAINT `product_material_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_material_ibfk_2` FOREIGN KEY (`material_id`) REFERENCES `materials` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_material`
--

LOCK TABLES `product_material` WRITE;
/*!40000 ALTER TABLE `product_material` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `short_description` text COLLATE utf8mb4_unicode_ci,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` float DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `category_id` int unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `product_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (7,'p001','Pizza Cheese','20260107_210904_cheese.jpg','Pizza with only cheese','Pizza is just cheese, cheese, and more cheese.',5.56,15,1,2,'2026-01-07 21:09:05','2026-01-07 21:09:05','pizza vegetarian'),(8,'p002','Pizza Vegetable','20260107_211211_vegetable.jpg','Pizza for vegetarians','Onions, bell peppers, mushrooms, cucumbers, and tomatoes',5.56,5,1,1,'2026-01-07 21:12:12','2026-01-07 21:12:12','pizza vegetarian'),(9,'p003','Pizza Pepperoni','20260107_211345_pepperoni.jpg','Pizza Cake Traditional','Italian-style sausages and tomato sauce',5.56,7,1,2,'2026-01-07 21:13:46','2026-01-07 21:13:46','pizza cake traditional'),(10,'p004','Pizza Chicken','20260107_211519_pizza_truyenthong_ganuong.png','Pizza cake traditional','Chicken and pineapple',5.56,7,1,2,'2026-01-07 21:15:20','2026-01-07 21:15:20','pizza cake traditional'),(11,'p005','Pizza Ham','20260107_211716_pizza_truyenthong_thitnguoi.png','Pizza Cake Traditional','Ham and Mushroom',5.56,10,1,2,'2026-01-07 21:17:17','2026-01-07 21:17:17','pizza cake traditional'),(12,'p006','Pizza Hawaii','20260107_211838_pizza_truyenthong_hawaii.png','Pizza Cake Traditional','Ham, Bacon, and Pineapple',5.56,5,1,2,'2026-01-07 21:18:38','2026-01-07 21:18:38','pizza cake traditional'),(13,'p007','Pizza Pesto','20260107_212257_pesto.png','Pizza Cake Seafood','Shrimp, Crab, Ham, and Thousand Island Sauce',6.36,20,1,1,'2026-01-07 21:22:58','2026-01-07 21:22:58','pizza cake seafood'),(14,'p008','Pizza Shrimp','20260107_212420_pizza_seafood_shrimp.png','Pizza Cake Seafood','Shrimp, crab, squid, clams, and Marinara sauce.',6.36,20,1,1,'2026-01-07 21:24:21','2026-01-07 21:24:21','pizza cake seafood'),(15,'p009','Pizza Black Pepper Shrimp','20260107_212623_pizza_seafood_pesto.png','Pizza Cake Seafood','Shrimp, crab, squid, clams, and black pepper',6.36,15,1,2,'2026-01-07 21:26:24','2026-01-07 21:26:24','pizza cake seafood'),(16,'p010','Spicy Clam Spaghetti','20260107_213203_mihaisan.png','Spicy Clam Spaghetti','Spicy Clam Spaghetti with a hint of natural sweetness.',5.56,5,1,3,'2026-01-07 21:32:03','2026-01-07 21:32:03','noodle'),(17,'p011','Clam Basil Spaghetti','20260107_213302_mingheuhap.png','Clam Basil Spaghetti','Basil spaghetti with the natural sweetness of clams.',5.56,5,1,3,'2026-01-07 21:33:02','2026-01-07 21:33:02','noodle'),(18,'p012','Pesto Spaghetti','20260107_213504_miy.png','Pesto Spaghetti','Spaghetti, shrimp, and squid blended with green Pesto sauce.',5.56,5,1,3,'2026-01-07 21:35:04','2026-01-07 21:35:04','noodle'),(19,'p013','7Up','20260107_213628_7up.png','7 UP','Carbonated soft drinks',1.16,20,1,3,'2026-01-07 21:36:28','2026-01-07 21:36:28','drinking water'),(20,'p014','Mirinda','20260107_213715_mirinda.png','MIRINDA','Carbonated soft drinks',1.16,20,1,3,'2026-01-07 21:37:16','2026-01-07 21:37:16','drinking water'),(21,'p015','Beer 333','20260107_213839_333.png','Beer 333','Alcoholic beverages',1.96,15,1,3,'2026-01-07 21:38:39','2026-01-07 21:38:39','drinking water'),(22,'p016','Beer Heineken','20260107_213917_heineken.png','Beer Heineken','Alcoholic beverages',1.96,15,1,3,'2026-01-07 21:39:17','2026-01-07 21:39:17','drinking water'),(23,'p017','Aquafina','20260107_214007_aquafina.png','Aquafina','Natural spring water',1.16,20,1,3,'2026-01-07 21:40:08','2026-01-07 21:40:08','drinking water'),(24,'p024','Pizza with 4 types of cheese','20260108_140359_combo_4phomai.png','Pizza Special','Four famous types of cheese combined with Vietnamese Coconut, served with Coconut Nectar.',7.56,5,1,2,'2026-01-08 14:03:59','2026-01-08 14:03:59','pizza combo'),(25,'p025','Pizza special Cheese','20260108_140509_combo_cheese.png','Pizza Special','Shrimp, four famous types of cheese combined with Vietnamese Coconut, served with Coconut Nectar.',7.56,5,1,1,'2026-01-08 14:05:09','2026-01-08 14:05:09','pizza combo'),(26,'p026','Pizza Special Pesto','20260108_140657_combo_haisanpesto.png','Pizza Special','Shrimp, crab sticks, squid, and fresh broccoli on a Green Pesto sauce base.',7.56,5,1,1,'2026-01-08 14:06:58','2026-01-08 14:06:58','pizza combo'),(27,'p027','Pizza Special Green Pesto','20260108_140806_combo_haipesstoxanh.png','Pizza  Special','Shrimp, crab sticks, squid with full toppings, and fresh broccoli on a Green Pesto sauce base.',7.56,4,1,1,'2026-01-08 14:08:07','2026-01-08 14:08:07','pizza combo'),(28,'p028','Pizza Pesto Black pepper','20260108_142758_pizza_seafood.png','Pizza Cake Seafood','Shrimp, crab, squid, clams, and Marinara sauce.',5.56,10,1,2,'2026-01-08 14:27:59','2026-01-08 14:27:59','pizza cake seafood');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount` float DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (1,'No discount',0,'There are no discounts of any kind.',1,'2025-12-31 00:00:00','2025-12-31',NULL),(2,'Noel',10,'Christmas discount program',1,'2025-12-20 00:00:00','2025-12-24','2025-12-26'),(3,'New Year',10,'New Year\'s 2026 discount program',1,'2025-12-31 00:00:00','2025-12-31','2026-01-01'),(4,'Lunar New Year',14,'Asian holiday discount program',1,'2025-12-31 00:00:00','2026-02-16','2026-02-19');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guard_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin','Administrator','web','2025-12-20 14:55:18','2025-12-20 14:55:18'),(2,'chef','Pizza Chef','web','2025-12-20 14:55:18','2025-12-20 14:55:18'),(3,'cashier','Cashier','web','2025-12-20 14:55:18','2025-12-20 14:55:18'),(4,'customer','Customer','web','2025-12-20 14:55:18','2025-12-20 14:55:18'),(5,'manager','Management','web','2026-01-05 15:29:18','2026-01-05 15:29:18');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_permissions`
--

DROP TABLE IF EXISTS `roles_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles_permissions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int unsigned NOT NULL,
  `permission_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `role_id` (`role_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `roles_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `roles_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=152 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_permissions`
--

LOCK TABLES `roles_permissions` WRITE;
/*!40000 ALTER TABLE `roles_permissions` DISABLE KEYS */;
INSERT INTO `roles_permissions` VALUES (1,4,1),(2,4,3),(3,4,13),(8,2,13),(9,2,14),(10,2,15),(11,2,16),(87,3,13),(88,3,14),(89,3,15),(90,3,16),(91,3,19),(118,1,1),(119,1,2),(120,1,3),(121,1,4),(122,1,17),(123,1,18),(124,1,13),(125,1,14),(126,1,15),(127,1,16),(128,1,19),(129,1,20),(130,1,21),(131,1,22),(132,1,5),(133,1,6),(134,1,7),(135,1,8),(136,1,9),(137,1,10),(138,1,11),(139,1,12),(140,1,23),(141,1,24),(142,1,25),(143,1,26),(144,1,53),(145,1,54),(146,1,55),(147,1,56),(148,1,49),(149,1,50),(150,1,51),(151,1,52);
/*!40000 ALTER TABLE `roles_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_levels`
--

DROP TABLE IF EXISTS `salary_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_levels` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `level_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hourly_wage` float NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_levels`
--

LOCK TABLES `salary_levels` WRITE;
/*!40000 ALTER TABLE `salary_levels` DISABLE KEYS */;
INSERT INTO `salary_levels` VALUES (1,'customer',0,'Customer No salary level'),(2,'employees',25000,'employees'),(3,'manager',60000,'manager stores');
/*!40000 ALTER TABLE `salary_levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `shift_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `wage_multiplier` float NOT NULL,
  `bonus` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'sup001','AN NHIEN Corp','20260102_115224_577562312_2188407715020307_5044873480267308774_n.jpg','07103941756','can tho','nha cung cap hang dau viet nam'),(2,'sup002','TAN NHIEN Corp','20251227_012306_CocosLogoTransparent.png','0939052119','dong nai','nha cung cap hang dau viet nam');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timesheets`
--

DROP TABLE IF EXISTS `timesheets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timesheets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `shift_id` int unsigned NOT NULL,
  `checkin` datetime NOT NULL,
  `checkout` datetime NOT NULL,
  `worked_date` datetime NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `shift_id` (`shift_id`),
  CONSTRAINT `timesheets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `timesheets_ibfk_2` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timesheets`
--

LOCK TABLES `timesheets` WRITE;
/*!40000 ALTER TABLE `timesheets` DISABLE KEYS */;
/*!40000 ALTER TABLE `timesheets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `email` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salary_level_id` int unsigned NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `active_code` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `salary_level_id` (`salary_level_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`salary_level_id`) REFERENCES `salary_levels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Trần Hữu Phúc','Huuphuc','$2a$10$stBX2kv6gOca9kp1.hGB/.47U6g/WuSrUCCe/6wpIRz/OGFswdmsa',1,'1996-09-22','huuphuc@gmail.com','20251218_102424_ngoc.jpg','0962428167','Cần Thơ',3,'2025-12-18 09:30:15','2025-12-25 13:22:14',1,NULL),(3,'Triệu Như Ngọc','NgocCute','$2a$10$SjW0pJHDqapMTHDrWzgwVO8U.AHjsBTuBJVgTIDa.LqJt/8p9pMby',0,'1996-02-09','ngoc@gmail.com','20251218_162349_images.jpg','0710941756','Ninh Kieu  - Can Tho',1,'2025-12-18 16:23:50','2025-12-27 10:05:50',1,NULL),(14,NULL,'Phuong','$2a$10$eGilmp.U5dQ9ERMaKI4gR.Ujpfr/ZEjeWBqEquZrTuZPwe2azvIuW',1,NULL,NULL,NULL,NULL,NULL,1,'2025-12-30 22:23:48','2025-12-30 22:23:48',1,NULL),(20,NULL,'Hao','$2a$10$3ZxW6qlmv.RmAHNPhL4ru.L5aY4Z1cA6kysvjj5HwqmWRFV946m7K',1,NULL,'coursemanager14@gmail.com',NULL,NULL,NULL,1,'2026-01-05 13:29:55','2026-01-05 13:33:00',1,NULL),(24,NULL,'Hong','$2a$10$ObatnC41gyF11uypyM.QfePBwI8Q6gw2btIwd/uF./h1wpOgWS40q',1,NULL,'coursemanager14@gmail.com',NULL,NULL,NULL,1,'2026-01-06 01:00:42','2026-01-06 01:06:24',1,NULL),(25,NULL,'Tuan','$2a$10$.1Mb.y6h6O3Ia.Ov9VMZ7.VAZKcD.Q//5JPrkezj3a8hkBhb9DSy.',1,NULL,'coursemanager14@gmail.com',NULL,NULL,NULL,1,'2026-01-06 01:10:37','2026-01-06 01:10:51',1,NULL),(26,'Nguyễn thị Ngọc Hương','NgocHuong','$2a$10$7F8BCO53jUAuMCGer1s5CewusYrVZn248Q2rwVZ3mmuLznG8rtdRa',0,NULL,'coursemanager14@gmail.com','20260106_011552_arin-oh-my-girl-khien-fan-mat-mat-voi-vong-eo-trang-nhu-dau-hu-4f1-5764935.jpg','0936052117','cần thơ',1,'2026-01-06 01:14:45','2026-01-06 01:15:53',1,NULL),(27,NULL,'Long','$2a$10$G1TfYG/eV7foDShTWFNDr.Prnj5uPWBhA1WebPM6jrTuLI8qQHGEm',1,NULL,'coursemanager14@gmail.com',NULL,NULL,NULL,1,'2026-01-06 01:23:42','2026-01-06 01:24:38',1,NULL),(28,NULL,'MinhLoan','$2a$10$Q0AclLU//utxgl6/m5qCfeXM63gJz2zhJy2lYyW50WNK8x2jWyfKG',1,NULL,'minhloan@ctu.edu.vn',NULL,NULL,NULL,1,'2026-01-08 19:08:20','2026-01-08 19:08:20',0,'81909d6f-aa6e-418e-830d-94d14ececa04'),(29,'Tran Huu Thinh','HuuThinh','$2a$10$OlRKvim2oe0URK4hGcF7meI1fDLgKHlfliMEDJu.g1Ok5XF86nXVW',1,'2008-06-20','coursemanager14@gmail.com','20260108_191347_images.jpg','0939052119','can tho',1,'2026-01-08 19:11:39','2026-01-08 19:13:47',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_roles` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `role_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `users_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (1,2,1),(5,14,4),(11,20,4),(15,24,4),(16,25,4),(17,26,4),(18,27,4),(21,3,3),(22,3,5),(23,28,4),(25,29,3);
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-10 22:49:09
