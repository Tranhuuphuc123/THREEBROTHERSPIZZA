-- DỰ ÁN WEB ĐỒ ÁN TỐT NGHIỆP APTECH JAVA SPRING BOOT  + NEXTJS: NHÓM 4 APTECH

CREATE DATABASE cake_maker
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE cake_maker;

CREATE TABLE suppliers (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  code VARCHAR(500) NOT NULL,
  name VARCHAR(500) NOT NULL,
  img TEXT,
  phone VARCHAR(20),
  address VARCHAR(500),
  description TEXT
);

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(500) NOT NULL,
  name VARCHAR(500) NOT NULL,
  description VARCHAR(500)
);

CREATE TABLE materials (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  img TEXT,
  category VARCHAR(500),
  supplier_id INT UNSIGNED NOT NULL,
  unit VARCHAR(100) NOT NULL,
  quantity INT,
  price FLOAT,
  expire_date DATE,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE promotions (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  discount FLOAT,
  description TEXT,
  is_active BOOLEAN,
  created_at DATETIME,
  start_date DATE,
  end_date DATE
);

CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  code VARCHAR(200) NOT NULL,
  name VARCHAR(500) NOT NULL,
  image TEXT,
  promotion_id INT UNSIGNED NOT NULL,
  short_description TEXT,
  description VARCHAR(500),
  price FLOAT,
  quantity FLOAT,
  is_active BOOLEAN,
  category_id INT UNSIGNED NOT NULL,
  supplier_id INT UNSIGNED NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (promotion_id) REFERENCES promotions(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE product_images (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  images TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE product_material (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  material_id INT UNSIGNED NOT NULL,
  unit VARCHAR(50),
  standard_price FLOAT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (material_id) REFERENCES materials(id)
);

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50),
  username VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  gender BOOLEAN,
  birthday DATE,
  email VARCHAR(500),
  avatar VARCHAR(500),
  phone VARCHAR(20),
  address VARCHAR(500),
  salary_level_id INT UNSIGNED NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_active BOOLEAN
);

CREATE TABLE salary_levels (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  level_name VARCHAR(255) NOT NULL,
  hourly_wage FLOAT NOT NULL,
  description VARCHAR(255)
);
ALTER TABLE users ADD FOREIGN KEY (salary_level_id) REFERENCES salary_levels(id);

CREATE TABLE roles (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(500) NOT NULL,
  display_name VARCHAR(200),
  guard_name VARCHAR(200),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE permissions (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(200),
  guard_name VARCHAR(200),
  created_at DATETIME,
  updated_at DATETIME
);

CREATE TABLE users_roles (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  role_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE roles_permissions (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  role_id INT UNSIGNED NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  promotion_id INT UNSIGNED NOT NULL,
  total_amount FLOAT,
  ship_address VARCHAR(200),
  delivery_at DATETIME,
  payment_type VARCHAR(50),
  status VARCHAR(50),
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (promotion_id) REFERENCES promotions(id)
);

CREATE TABLE order_details (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  unit_price FLOAT NOT NULL,
  quantity INT,
  subtotal FLOAT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE feedbacks (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  product_id INT UNSIGNED NOT NULL,
  user_id INT UNSIGNED NOT NULL,
  rating INT,
  message TEXT,
  is_active BOOLEAN,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE shifts (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  shift_name VARCHAR(50) NOT NULL,
  start_time DATETIME,
  end_time DATETIME,
  wage_multiplier FLOAT NOT NULL,
  bonus FLOAT
);

CREATE TABLE timesheets (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  shift_id INT UNSIGNED NOT NULL,
  checkin DATETIME NOT NULL,
  checkout DATETIME NOT NULL,
  worked_date DATETIME NOT NULL,
  note TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (shift_id) REFERENCES shifts(id)
);

-- INSERT INTO suppliers (code, name, img, phone, address, description)
-- INSERT INTO suppliers (code, name, img, phone, address, description) VALUES
-- ('SUP-FLOUR','Napoli Flour Supplier',NULL,'0901000001','District 1','Pizza flour supplier'),
-- ('SUP-CHEESE','Italian Cheese Co',NULL,'0901000002','District 1','Mozzarella and cheese supplier'),
-- ('SUP-SAUSE','Tomato Sauce Farm',NULL,'0901000003','District 2','Tomato sauce supplier'),
-- ('SUP-MEAT','Premium Meat Supplier',NULL,'0901000004','District 3','Pepperoni and meat supplier'),
-- ('SUP-VEG','Fresh Vegetable Farm',NULL,'0901000005','District 4','Vegetable supplier'),
-- ('SUP-SEA','Seafood Market',NULL,'0901000006','District 7','Seafood supplier'),
-- ('SUP-SAUCE','BBQ Sauce Factory',NULL,'0901000007','District 2','BBQ sauce supplier'),
-- ('SUP-FRUIT','Fruit Supplier',NULL,'0901000008','District 5','Pineapple and fruit supplier'),
-- ('SUP-DESSERT','Dessert Ingredient Co',NULL,'0901000009','District 10','Sweet ingredients supplier'),
-- ('SUP-OTHER','Local Market Supplier',NULL,'0901000010','District 8','General material supplier');

-- -- INSERT INTO categories (code, name, description)
-- INSERT INTO categories (code, name, description) VALUES
-- ('CAT-CLASSIC','Classic Pizza','Classic Italian pizza'),
-- ('CAT-MEAT','Meat Lovers','Pizza with many meats'),
-- ('CAT-CHICKEN','Chicken Pizza','Pizza with chicken'),
-- ('CAT-VEGETARIAN','Vegetarian','Vegetarian pizza'),
-- ('CAT-SEAFOOD','Seafood','Pizza with seafood'),
-- ('CAT-CHEESE','Cheese','Cheese focused pizza'),
-- ('CAT-SPICY','Spicy','Spicy pizza'),
-- ('CAT-PREMIUM','Premium','Premium ingredients'),
-- ('CAT-KIDS','Kids','Pizza for kids'),
-- ('CAT-DESSERT','Dessert','Sweet dessert pizza');

-- -- INSERT INTO materials (name,img,category,supplier_id,unit,quantity,price,expire_date,created_at,updated_at)
-- INSERT INTO materials
-- (name,img,category,supplier_id,unit,quantity,price,expire_date,created_at,updated_at)
-- VALUES
-- ('Pizza Flour',NULL,'Flour',1,'kg',100,20,'2026-01-01',NOW(),NOW()),
-- ('Mozzarella Cheese',NULL,'Cheese',2,'kg',80,120,'2025-09-01',NOW(),NOW()),
-- ('Tomato Sauce',NULL,'Sauce',3,'kg',150,40,'2025-12-01',NOW(),NOW()),
-- ('Pepperoni',NULL,'Meat',4,'kg',60,160,'2025-08-01',NOW(),NOW()),
-- ('Ham',NULL,'Meat',4,'kg',70,150,'2025-08-10',NOW(),NOW()),
-- ('Pineapple',NULL,'Fruit',8,'kg',50,65,'2025-07-01',NOW(),NOW()),
-- ('Mixed Vegetables',NULL,'Vegetable',5,'kg',90,70,'2025-06-15',NOW(),NOW()),
-- ('BBQ Chicken',NULL,'Meat',7,'kg',55,170,'2025-06-20',NOW(),NOW()),
-- ('Seafood Mix',NULL,'Seafood',6,'kg',40,200,'2025-06-30',NOW(),NOW()),
-- ('Chocolate Spread',NULL,'Dessert',9,'kg',30,220,'2025-10-01',NOW(),NOW());

-- -- INSERT INTO promotions (name,discount,description,is_active,created_at,start_date,end_date)
-- -- (ID 11 - No Promotion được chèn ở Bước 1)
-- INSERT INTO promotions
-- (name,discount,description,is_active,created_at,start_date,end_date) VALUES
-- ('Grand Opening Discount',20,'Opening promotion',1,NOW(),'2025-01-01','2025-01-31'),
-- ('Pepperoni Combo',15,'Pepperoni combo discount',1,NOW(),'2025-02-01','2025-02-28'),
-- ('Happy Hour',10,'Happy hour discount',1,NOW(),'2025-01-15','2025-03-15'),
-- ('Hawaiian Day',25,'Hawaiian pizza promotion',1,NOW(),'2025-01-20','2025-04-20'),
-- ('Vegetarian Week',30,'Vegetarian promotion',1,NOW(),'2025-02-10','2025-03-10'),
-- ('Seafood Weekend',18,'Seafood weekend promotion',1,NOW(),'2025-02-15','2025-04-15'),
-- ('Member Discount',10,'Member discount',1,NOW(),'2025-01-01','2025-12-31'),
-- ('Lunch Set',12,'Lunch time discount',1,NOW(),'2025-02-01','2025-06-01'),
-- ('Birthday Discount',30,'Birthday promotion',1,NOW(),'2025-01-01','2025-12-31'),
-- ('Dessert Sale',35,'Dessert promotion',1,NOW(),'2025-03-01','2025-04-01');

-- -- INSERT INTO products (code,name,image,promotion_id,short_description,description,price,quantity,is_active,category_id,supplier_id,created_at,updated_at)
-- INSERT INTO products
-- (code,name,image,promotion_id,short_description,description,
--  price,quantity,is_active,category_id,supplier_id,created_at,updated_at)
-- VALUES
-- ('PZ001','Margherita',NULL,1,'Classic cheese pizza','Tomato sauce and mozzarella',
--  90000,100,1,1,1,NOW(),NOW()),
-- ('PZ002','Pepperoni',NULL,2,'Pepperoni pizza','Pepperoni with cheese',
--  150000,80,1,2,4,NOW(),NOW()),
-- ('PZ003','Hawaiian',NULL,4,'Ham pineapple pizza','Ham and pineapple',
--  190000,60,1,2,4,NOW(),NOW()),
-- ('PZ004','BBQ Chicken',NULL,3,'BBQ chicken pizza','BBQ sauce chicken',
--  170000,70,1,3,7,NOW(),NOW()),
-- ('PZ005','Veggie Supreme',NULL,5,'Vegetable pizza','Mixed vegetables',
--  140000,75,1,4,5,NOW(),NOW()),
-- ('PZ006','Meat Lovers',NULL,3,'Meat pizza','Pepperoni ham sausage',
--  210000,50,1,2,4,NOW(),NOW()),
-- ('PZ007','Seafood Deluxe',NULL,6,'Seafood pizza','Shrimp and squid',
--  200000,40,1,5,6,NOW(),NOW()),
-- ('PZ008','Four Cheese',NULL,3,'Cheese pizza','Four cheese blend',
--  185000,45,1,6,2,NOW(),NOW()),
-- ('PZ009','Spicy Chicken',NULL,7,'Spicy pizza','Spicy chicken',
--  175000,55,1,7,7,NOW(),NOW()),
-- ('PZ010','Dessert Pizza',NULL,10,'Sweet pizza','Chocolate dessert pizza',
--  120000,30,1,10,9,NOW(),NOW());

-- -- INSERT 
-- INSERT INTO product_material
-- (product_id,material_id,unit,standard_price,created_at) VALUES
-- (1,1,'200g',15,NOW()),
-- (1,2,'80g',20,NOW()),
-- (2,4,'70g',30,NOW()),
-- (3,5,'80g',25,NOW()),
-- (3,6,'60g',18,NOW()),
-- (4,8,'90g',32,NOW()),
-- (5,7,'100g',22,NOW()),
-- (6,4,'90g',35,NOW()),
-- (7,9,'100g',40,NOW()),
-- (10,10,'60g',28,NOW());


-- INSERT INTO salary_levels (level_name, hourly_wage, description) VALUES
-- ('customer',0,'Customer No salary level'),
-- ('employees',25000,'employees'),
-- ('manager',60000,'manager stores');


-- INSERT INTO users
-- (name,username,password,gender,birthday,email,avatar,phone,address,
--  salary_level_id,created_at,updated_at,is_active)
-- VALUES
-- ('Admin','admin','admin123',1,'1990-01-01','admin@pizza.com',NULL,'0909000001','Store',5,NOW(),NOW(),1),
-- ('Manager','manager','manager123',1,'1988-02-02','manager@pizza.com',NULL,'0909000002','Store',5,NOW(),NOW(),1),
-- ('Chef','chef','chef123',1,'1992-03-03','chef@pizza.com',NULL,'0909000003','Store',3,NOW(),NOW(),1),
-- ('Cashier','cashier','cashier123',0,'1995-04-04','cashier@pizza.com',NULL,'0909000004','Store',2,NOW(),NOW(),1),
-- ('Delivery 1','delivery1','delivery123',1,'1998-05-05','ship1@pizza.com',NULL,'0909000005','Store',1,NOW(),NOW(),1),
-- ('Delivery 2','delivery2','delivery123',1,'1998-06-06','ship2@pizza.com',NULL,'0909000006','Store',1,NOW(),NOW(),1),
-- ('Customer A','custA','cust123',1,'1995-07-07','a@mail.com',NULL,'0910000001','HCM',11,NOW(),NOW(),1),
-- ('Customer B','custB','cust123',0,'1996-08-08','b@mail.com',NULL,'0910000002','HCM',11,NOW(),NOW(),1),
-- ('Customer C','custC','cust123',1,'1997-09-09','c@mail.com',NULL,'0910000003','HCM',11,NOW(),NOW(),1),
-- ('Customer D','custD','cust123',0,'1999-10-10','d@mail.com',NULL,'0910000004','HCM',11,NOW(),NOW(),1);


-- INSERT INTO orders
-- (user_id,promotion_id,total_amount,ship_address,delivery_at,
--  payment_type,status,created_at,updated_at)
-- VALUES
-- (11,1,90000,'HCM','2025-01-02 12:00','CASH','DELIVERED',NOW(),NOW()),
-- (13,2,150000,'HCM','2025-01-02 19:00','MOMO','DELIVERED',NOW(),NOW()),
-- (14,4,190000,'HCM','2025-01-03 13:00','ZALO','DELIVERED',NOW(),NOW());

-- INSERT INTO shifts (shift_name, start_time, end_time, wage_multiplier, bonus)
-- INSERT INTO shifts
-- (shift_name, start_time, end_time, wage_multiplier, bonus) VALUES
-- ('Morning Shift','2025-01-01 08:00','2025-01-01 15:00',1.0,0),
-- ('Lunch Shift','2025-01-01 12:00','2025-01-01 19:00',1.0,0),
-- ('Night Shift','2025-01-01 17:00','2025-01-01 22:00',1.1,20000);

-- INSERT INTO roles (name, display_name, guard_name, created_at, updated_at)
-- INSERT INTO roles
-- (name, display_name, guard_name, created_at, updated_at) VALUES
-- ('admin','Administrator','web',NOW(),NOW()),
-- ('manager','Store Manager','web',NOW(),NOW()),
-- ('chef','Pizza Chef','web',NOW(),NOW()),
-- ('cashier','Cashier','web',NOW(),NOW()),
-- ('delivery','Delivery Staff','web',NOW(),NOW()),
-- ('customer','Customer','web',NOW(),NOW()),
-- ('hr','HR','web',NOW(),NOW());

-- INSERT INTO permissions
-- (name, display_name, guard_name, created_at, updated_at) VALUES
-- ('view_products','View Products','web',NOW(),NOW()),
-- ('manage_products','Manage Products','web',NOW(),NOW()),
-- ('view_orders','View Orders','web',NOW(),NOW()),
-- ('manage_orders','Manage Orders','web',NOW(),NOW()),
-- ('manage_users','Manage Users','web',NOW(),NOW()),
-- ('manage_promotions','Manage Promotions','web',NOW(),NOW()),
-- ('view_reports','View Reports','web',NOW(),NOW()),
-- ('manage_timesheets','Manage Timesheets','web',NOW(),NOW()),
-- ('manage_salary','Manage Salary','web',NOW(),NOW()),
-- ('view_dashboard','View Dashboard','web',NOW(),NOW());
