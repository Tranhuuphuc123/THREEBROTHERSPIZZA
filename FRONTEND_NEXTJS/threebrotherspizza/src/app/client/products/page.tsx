"use client";

import { Container, Row, Nav, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/client/ProductCard";
import { useSearchParams } from "next/navigation"; 
import axiosClient from "@/axios/axiosAdmin";

//make variale api url file upload img
import { UPLOAD_URL } from "@/constants/urls";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const productType = searchParams.get("type") || "pizza";
  
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainProductType, setMainProductType] = useState(productType);

  // Map productType từ URL sang title hiển thị
  const getProductTitle = (type: string): string => {
    const titleMap: { [key: string]: string } = {
      "combo": "COMBO",
      "pizza": "PIZZA",
      "noodle": "NOODLE",
      "pasta": "NOODLE",
      "drinking water": "DRINKING WATER",
      "drink": "DRINKING WATER",
    };
    
    // Nếu không tìm thấy trong map, tự động format từ type
    if (titleMap[type.toLowerCase()]) {
      return titleMap[type.toLowerCase()];
    }
    
    // Tự động format: "pizza cake seafood" -> "PIZZA CAKE SEAFOOD"
    return type.toUpperCase();
  };

  // Danh sách sub-types cho Pizza
  const pizzaSubTypes = [
    { value: "all", label: "All Pizza" },
    { value: "pizza combo", label: "Combo" },
    { value: "pizza vegetarian", label: "Vegetarian" },
    { value: "pizza cake traditional", label: "Traditional" },
    { value: "pizza cake seafood", label: "Seafood" },
    { value: "pizza mixed", label: "Mixed" },
  ];
  
  // Gọi API lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        
        // Xử lý đặc biệt cho Pizza: nếu là pizza hoặc bắt đầu bằng "pizza"
        if (mainProductType === "pizza" || mainProductType.toLowerCase().startsWith("pizza")) {
          if (activeTab === "all") {
            // Lấy TẤT CẢ pizza bằng pattern
            response = await axiosClient.get(`/products/client-list-pattern`, {
              params: { productTypePattern: "pizza" }
            });
          } else {
            // Lấy pizza theo sub-type cụ thể
            response = await axiosClient.get(`/products/client-list`, {
              params: { productType: activeTab }
            });
          }
        } else {
          // Các loại khác (combo, noodle, drinking water) dùng API bình thường
          response = await axiosClient.get(`/products/client-list`, {
            params: { productType: mainProductType }
          });
        }

        if (response.data.statuscode === 200 && response.data.data) {
          const mappedData = response.data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.shortDescription || item.description || "",
            price: formatPrice(item.price),
            image: item.image ? `${UPLOAD_URL}/${item.image}` : "/assets/admin/img/no-avatar.png",
            tag: item.isActive === 1 ? "Hot" : undefined,
            productType: item.productType,
          }));
          
          setProducts(mappedData);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [mainProductType, activeTab]);

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + "đ";
  };

  // Cập nhật mainProductType khi URL thay đổi
  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      // Chuẩn hóa type: nếu là "pizza cake seafood" hoặc bất kỳ pizza nào -> "pizza"
      const normalizedType = type.toLowerCase().startsWith("pizza") ? "pizza" : type.toLowerCase();
      setMainProductType(normalizedType);
      setActiveTab(normalizedType === "pizza" ? "all" : "special");
    }
  }, [searchParams]);

  // Màu đỏ thương hiệu Pizza
  const brandRed = "#e31837";

  const displayTitle = getProductTitle(mainProductType);

  return (
    <Container className="py-4">
      <h2 className="fs-4 fw-bold mb-4 border-bottom pb-3">
        {displayTitle}
      </h2>

      {/* Menu Tabs - Chỉ hiện khi là Pizza */}
      {mainProductType === "pizza" && (
        <Nav 
          variant="pills" 
          className="mb-5 justify-content-center gap-2 p-2 rounded shadow-sm" 
          style={{ backgroundColor: "#f8f9fa" }}
        >
          {pizzaSubTypes.map((subType) => (
            <Nav.Item key={subType.value}>
              <Nav.Link 
                active={activeTab === subType.value} 
                onClick={() => setActiveTab(subType.value)}
                className="px-4 fw-bold"
                style={{ 
                  backgroundColor: activeTab === subType.value ? brandRed : "transparent",
                  color: activeTab === subType.value ? "white" : "#333",
                  border: "none"
                }}
              >
                {subType.label}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      )}

      {/* Header danh mục */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <h3 className="fs-5 fw-bold text-secondary mb-0">
          {mainProductType === "pizza" && activeTab !== "all" 
            ? pizzaSubTypes.find(t => t.value === activeTab)?.label || displayTitle
            : displayTitle}
        </h3>
        
        {/* Bảng giá nhanh - chỉ hiện cho Pizza */}
        {mainProductType === "pizza" && (
          <Stack direction="horizontal" gap={4} className="small d-none d-md-flex">
            <div style={{ color: brandRed }}>
              <i className="bi bi-circle-fill me-1" style={{ fontSize: '10px' }}></i>
              Big size: <span className="fw-bold text-dark">6.16 USD</span>
            </div>
            <div style={{ color: brandRed }}>
              <i className="bi bi-circle-fill me-1" style={{ fontSize: '8px' }}></i>
              Medium size: <span className="fw-bold text-dark">5.16 USD</span>
            </div>
            <div style={{ color: brandRed }}>
              <i className="bi bi-circle-fill me-1" style={{ fontSize: '6px' }}></i>
              Small size: <span className="fw-bold text-dark">4.5 USD</span>
            </div>
          </Stack>
        )}
      </div>

      {/* VÒNG LẶP ĐỔ DỮ LIỆU VÀO COMPONENT CON */}
      {loading ? (
        <div className="text-center py-5">Is Loading...</div>
      ) : products.length > 0 ? (
        <Row className="g-4">
          {products.map((item) => (
            <ProductCard key={item.id} data={item} />
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 text-muted">No Products..</div>
      )}
    </Container>
  );
}