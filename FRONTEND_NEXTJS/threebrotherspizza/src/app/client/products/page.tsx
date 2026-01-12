"use client";

import { Container, Row, Nav, Stack } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/client/ProductCard";
import { useSearchParams } from "next/navigation"; 
import axiosClient from "@/axios/axiosAdmin";
import { UPLOAD_URL } from "@/constants/urls";

export default function ProductPage() {
  const searchParams = useSearchParams();
  const productType = searchParams.get("type") || "all";
  
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainProductType, setMainProductType] = useState(productType);

  // 1. Define Main Categories
  const mainTabs = [
    { value: "all", label: "ALL PRODUCTS" },
    { value: "pizza", label: "PIZZA" },
    { value: "noodle", label: "PASTA" },
    { value: "drinking water", label: "DRINKS" },
  ];

  // 2. Define Sub-types for Pizza
  const pizzaSubTypes = [
    { value: "all", label: "All Pizza" },
    { value: "pizza combo", label: "Combo" },
    { value: "pizza vegetarian", label: "Vegetarian" },
    { value: "pizza cake traditional", label: "Traditional" },
    { value: "pizza cake seafood", label: "Seafood" },
    { value: "pizza mixed", label: "Mixed" },
  ];

  const getProductTitle = (type: string): string => {
    const titleMap: { [key: string]: string } = {
      "all": "OUR MENU",
      "pizza": "HOT PIZZA",
      "noodle": "PASTA & NOODLES",
      "drinking water": "REFRESHING DRINKS",
    };
    return titleMap[type.toLowerCase()] || type.toUpperCase();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        // Case 1: Show All Products
        if (mainProductType === "all") {
          response = await axiosClient.get(`/products/client-list-pattern`, {
            params: { productTypePattern: "" } 
          });
        } 
        // Case 2: Pizza with Sub-filtering
        else if (mainProductType === "pizza") {
          if (activeTab === "all") {
            response = await axiosClient.get(`/products/client-list-pattern`, {
              params: { productTypePattern: "pizza" }
            });
          } else {
            response = await axiosClient.get(`/products/client-list`, {
              params: { productType: activeTab }
            });
          }
        } 
        // Case 3: Other categories (Pasta, Drink)
        else {
          response = await axiosClient.get(`/products/client-list`, {
            params: { productType: mainProductType }
          });
        }

        if (response.data.statuscode === 200 && response.data.data) {
          const mappedData = response.data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.shortDescription || item.description || "",
            price: item.price,
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

  // Handle URL change from Homepage (View All buttons)
  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      const lowType = type.toLowerCase();
      if (lowType.startsWith("pizza")) {
        setMainProductType("pizza");
        setActiveTab(lowType === "pizza" ? "all" : lowType);
      } else {
        setMainProductType(lowType);
        setActiveTab("all");
      }
    } else {
      setMainProductType("all");
      setActiveTab("all");
    }
  }, [searchParams]);

  const brandRed = "#e31837";

  return (
    <Container className="py-4">
      <h2 className="fs-4 fw-bold mb-4 border-bottom pb-3 text-center">
        {getProductTitle(mainProductType)}
      </h2>

      {/* MAIN TABS */}
      <Nav variant="pills" className="justify-content-center mb-3 gap-2">
        {mainTabs.map((tab) => (
          <Nav.Item key={tab.value}>
            <Nav.Link 
              active={mainProductType === tab.value}
              onClick={() => {
                setMainProductType(tab.value);
                setActiveTab("all");
              }}
              className="fw-bold px-4 shadow-sm"
              style={{
                backgroundColor: mainProductType === tab.value ? brandRed : "#f8f9fa",
                color: mainProductType === tab.value ? "white" : "#333",
              }}
            >
              {tab.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* SUB TABS (Pizza Filters) */}
      {(mainProductType === "pizza" || (mainProductType === "all" && activeTab === "all")) && (
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5 p-3 rounded shadow-sm" style={{ backgroundColor: "#fff5f5" }}>
          <span className="w-100 text-center mb-2 small fw-bold text-muted">FILTER PIZZA BY TYPE:</span>
          {pizzaSubTypes.map((sub) => (
            <button
              key={sub.value}
              onClick={() => {
                setMainProductType("pizza");
                setActiveTab(sub.value);
              }}
              className="btn btn-sm rounded-pill px-3 fw-bold"
              style={{
                backgroundColor: activeTab === sub.value ? "#333" : "transparent",
                color: activeTab === sub.value ? "white" : "#333",
                border: `1px solid ${activeTab === sub.value ? "#333" : "#ddd"}`,
              }}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* Content Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fs-5 fw-bold text-secondary mb-0">
          {mainProductType === "pizza" && activeTab !== "all" 
            ? pizzaSubTypes.find(t => t.value === activeTab)?.label 
            : "Displaying all items"}
        </h3>
        
        {mainProductType === "pizza" && (
          <Stack direction="horizontal" gap={3} className="small d-none d-md-flex text-muted">
            <span><i className="bi bi-info-circle me-1"></i>Prices vary by size (S/M/L)</span>
          </Stack>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">Loading products...</div>
      ) : products.length > 0 ? (
        <Row className="g-4">
          {products.map((item) => (
            <ProductCard key={item.id} data={item} />
          ))}
        </Row>
      ) : (
        <div className="text-center py-5 text-muted">No products found in this category.</div>
      )}
    </Container>
  );
}