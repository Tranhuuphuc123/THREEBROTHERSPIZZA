-- DỰ ÁN WEB ĐỒ ÁN TỐT NGHIỆP APTECH JAVA SPRING BOOT  + NEXTJS: NHÓM 4 APTECH

-- tai khoan text: Huuphuc - Admin123#
DROP DATABASE cake_maker;
CREATE DATABASE cake_maker
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE cake_maker;

-- nhóm lệnh truy ván  user phân quyền
select * from roles;
select * from users;
select * from permissions;
select * from users_roles;
select * from roles_permissions;

-- nhóm truy vấn sản phẩm
select * from categories;
select * from products;
select * from materials;
select * from product_material;

-- nhóm truy vấn bậc lưng
select * from salary_levels;
select * from shifts;
select * from suppliers;

-- nhóm truy vấn của order
select * from payment_types;
select * from orders;
select * from order_details;
select * from promotions;
select * from users;
select * from products;
select * from customer;

-- show value: name và type trong table chỉ định cụ thể
-- show create table products;
-- lệnh tắt kiểm tra khóa ngoại 
-- set foreign_key_checks = 0;
-- delete from users_roles where id in (12,13)
CREATE TABLE suppliers (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  code VARCHAR(500) NOT NULL,
  name VARCHAR(500) NOT NULL,
  img TEXT,
  phone VARCHAR(20),
  address VARCHAR(500),
  description TEXT
);

select * from roles_permissions;
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
  is_active BOOLEAN,  -- với promotion của api này thì nền cho nó cơ chế auto tự động bắt ngày mà bật isActive
  created_at DATETIME,
  start_date DATE,
  end_date DATE
);

CREATE TABLE products (
  id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
  code VARCHAR(200) NOT NULL,
  name VARCHAR(500) NOT NULL,
  image TEXT,
  short_description TEXT,
  description VARCHAR(500),
  price FLOAT,
  quantity INT,
  is_active BOOLEAN,
  category_id INT UNSIGNED NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  product_type VARCHAR(100),
  FOREIGN KEY (promotion_id) REFERENCES promotions(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
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
  name VARCHAR(100),
  username VARCHAR(250) NOT NULL,
  password VARCHAR(250) NOT NULL,
  gender BOOLEAN,
  birthday DATE,
  email VARCHAR(500),
  avatar VARCHAR(500),
  phone VARCHAR(20),
  address VARCHAR(500),
  salary_level_id INT UNSIGNED NOT NULL,
  created_at DATETIME,
  updated_at DATETIME,
  is_active BOOLEAN,
  active_code VARCHAR(200) -- khoa mã code dùng để active cho t/h gì đó vd xác nhận email
);
ALTER TABLE users
ADD COLUMN active_code VARCHAR(200);


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
  module_name VARCHAR(100),
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


-- create table payment_type
create table payment_types (
    id int unsigned auto_increment not null primary key,
    code varchar(100),
    name varchar(300),
    description text,
    image text,
    created_at datetime,
    updated_at datetime
);

-- create table order
create table orders (
    id int unsigned auto_increment not null primary key,
    cashier_id int unsigned,
    customer_id int unsigned,
    payment_type_id int unsigned,
    ship_name varchar(100),
    ship_address varchar(200),
    order_date datetime,
    shipped_date datetime,
    paid_date datetime,
    status boolean,
    ship_method varchar(100),
    note text,
    created_at datetime,
    updated_at datetime,

    -- định nghĩa các khóa ngoại và đặt tên constraint
    constraint fk_orders_cashier 
        foreign key (cashier_id) references users(id) 
        on delete set null,
        
    constraint fk_orders_customer 
        foreign key (customer_id) references users(id) 
        on delete set null,
        
    constraint fk_orders_payment_type 
        foreign key (payment_type_id) references payment_types(id) 
        on delete set null
);
        
-- create table orderDetail
create table order_details (
    id int unsigned auto_increment not null primary key,
    -- các khóa ngoại để int unsigned (không âm) và cho phép null
    order_id int unsigned,
    product_id int unsigned,
    promotion_id int unsigned,
    quantity int,
    unit_price float,
    order_detail_status boolean,
    subtotal float,
    created_at datetime,
    updated_at datetime,
    
    -- định nghĩa các ràng buộc khóa ngoại có đặt tên
    constraint fk_order_details_order 
        foreign key (order_id) references orders(id) 
        on delete set null,
        
    constraint fk_order_details_product 
        foreign key (product_id) references products(id) 
        on delete set null,
        
    constraint fk_order_details_promotion 
        foreign key (promotion_id) references promotions(id) 
        on delete set null
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

