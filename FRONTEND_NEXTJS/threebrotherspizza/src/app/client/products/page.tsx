"use client";

import { Container, Row, Nav, Stack } from "react-bootstrap";
import { useState } from "react";
import { ProductCard } from "@/components/client/ProductCard";

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState("special");

  // Dữ liệu giả lập (Sau này sẽ thay bằng API)
  const pizzaData = [
    { id: 1, name: "Pizza 4 Cheese", description: "4 loại phô mai trứ danh...", price: "179.000đ", image: "/assets/client/img/pizzaCake/pepperoni.jpg", tag: "Đặc sản" },
    { id: 2, name: "Pizza Hải Sản", description: "Hải sản tươi ngon...", price: "169.000đ", image: "/assets/client/img/pizzaCake/cheese.jpg", tag: "Di sản" },
    { id: 3, name: "Pizza Pesto", description: "Xốt pesto xanh đặc trưng...", price: "189.000đ", image: "/assets/client/img/pizzaCake/pesto.png" },
  ];

  // Màu đỏ thương hiệu Pizza (Sử dụng trực tiếp qua style để thay cho CSS module)
  const brandRed = "#e31837";

  return (
    <Container className="py-4">
      <h2 className="fs-4 fw-bold mb-4 border-bottom pb-3">Pizza</h2>

      {/* Menu Tabs */}
      <Nav 
        variant="pills" 
        className="mb-5 justify-content-center gap-2 p-2 rounded shadow-sm" 
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <Nav.Item>
          <Nav.Link 
            active={activeTab === "special"} 
            onClick={() => setActiveTab("special")}
            className="px-4 fw-bold"
            style={{ 
              backgroundColor: activeTab === "special" ? brandRed : "transparent",
              color: activeTab === "special" ? "white" : "#333",
              border: "none"
            }}
          >
            Combo Special
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="text-dark px-4 fw-bold">Seafood</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="text-dark px-4 fw-bold">Traditional</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="text-dark px-4 fw-bold">Vegetabrian</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="text-dark px-4 fw-bold">Mixed</Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Header danh mục và Bảng giá nhanh */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h3 className="fs-5 fw-bold text-secondary mb-0">Combo Special</h3>
        
        <Stack direction="horizontal" gap={4} className="small d-none d-md-flex">
          <div style={{ color: brandRed }}>
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '10px' }}></i>
            Lớn: <span className="fw-bold text-dark">359k</span>
          </div>
          <div style={{ color: brandRed }}>
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '8px' }}></i>
            Vừa: <span className="fw-bold text-dark">249k</span>
          </div>
          <div style={{ color: brandRed }}>
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '6px' }}></i>
            Nhỏ: <span className="fw-bold text-dark">169k</span>
          </div>
        </Stack>
      </div>

      {/* VÒNG LẶP ĐỔ DỮ LIỆU VÀO COMPONENT CON */}
      <Row className="g-4">
        {pizzaData.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
      </Row>
    </Container>
  );
}