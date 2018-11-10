DROP DATABASE IF EXISTS  bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;



CREATE TABLE items (
    item_id INT AUTO_INCREMENT NOT NULL,
    item_name VARCHAR(90) NOT NULL,
    item_category VARCHAR(90) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT,
    PRIMARY KEY (item_id),
);


INSERT INTO items (item_name,item_category,price,stock_quantity)
VALUES ("Toothpaste","Personal Care",2.35,837 );


SELECT * FROM items;