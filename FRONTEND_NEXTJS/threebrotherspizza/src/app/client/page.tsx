/*'use client' là một chỉ thị (directive) dùng để đánh dấu Component này sẽ 
chạy ở Trình duyệt (Client) thay vì chạy ở Server.
 >>>>Tại sao phải dùng?<<<<<<<
    # Bạn bắt buộc phải ghi nó ở đầu file khi Component có sử dụng:
        + React Hooks: Như useState, useEffect, useContext.
        + Tương tác: Như onClick, onChange, onSubmit.
        + Browser API: Như window, document, localStorage.

    # Cơ chế hoạt động:
        + Mặc định: Next.js coi mọi Component là Server Component
         (không có tính tương tác, không có state).
        + Khi có 'use client': Next.js sẽ tải thêm mã JavaScript 
        xuống trình duyệt để người dùng có thể click, nhập liệu và
         xử lý các logic động. */
"use client";

/* xin chao cac ban minh la body Homepage cua client layout hehehe */
import {
  Carousel,
  Container,
  Row,
  Button,
} from "react-bootstrap";
import CarouselItem from "react-bootstrap/CarouselItem";
import CarouselCaption from "react-bootstrap/CarouselCaption";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import { ProductCard } from "@/components/client/ProductCard";
import Link from "next/link";
//import axios call api đổ value của product vào product carc
import axiosClient from '@/axios/axiosAdmin'
import { useEffect, useState } from "react";

//make variale api url file upload img
import { UPLOAD_URL } from "@/constants/urls";

/* phan body cua homepage cuar client page layout */
export default function HomePage() {

  /* state lưu dữ liệu từ api */
  const [comboData, setComboData] = useState<any[]>([]);
  const [pizzaData, setPizzaData] = useState<any[]>([]);
  const [pastaData, setPastaData] = useState<any[]>([]);
  const [drinkData, setDrinkData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* Hàm gọi API theo productType*/
  const fetchProductsByType = async (productType: string) => {
    try {
      const response = await axiosClient.get(`/products/client-list`, {
        params: { productType }
      });
      
      if (response.data.statuscode === 200 && response.data.data) {
        // Map dữ liệu từ API sang format ProductCard cần
        return response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.shortDescription || item.description || "",
          price: formatPrice(item.price),
          image: item.image ? `${UPLOAD_URL}/${item.image}` : "/assets/client/img/default.png",
          tag: item.isActive === 1 ? "Hot" : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${productType}:`, error);
      return [];
    }
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + "đ";
  };

  // Gọi API khi component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      // Gọi song song tất cả API
      const [special, pizza, pasta, drink] = await Promise.all([
        fetchProductsByType("pizza combo"),
        fetchProductsByType("pizza cake seafood"),
        fetchProductsByType("noodle"),
        fetchProductsByType("drinking water"),
      ]);

      // Chỉ lấy 4 sản phẩm đầu tiên cho homepage
      setComboData(special.slice(0, 4));
      setPizzaData(pizza.slice(0, 4));
      setPastaData(pasta.slice(0, 4));
      setDrinkData(drink.slice(0, 4));
      setLoading(false);
    };

    loadData();
  }, []);

  /* Render Section Helper để code ngắn gọn*/
  const ProductSection = ({ title, data, productType }: { title: string, data: any[], productType: string }) => (
    <Container className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="fs-3 fw-bold text-dark mb-0">{title}</h2>
        <Link href={`/client/products?type=${productType}`} passHref>
          <Button variant="link" className="text-danger fw-bold text-decoration-none">
            View All
          </Button>
        </Link>
      </div>
      <Row className="g-4">
        {loading ? (
          <div className="text-center py-5">loading...</div>
        ) : data.length > 0 ? (
          data.map((item) => (
            <ProductCard key={item.id} data={item} />
          ))
        ) : (
          <div className="text-center py-5 text-muted">No product data..</div>
        )}
      </Row>
    </Container>
  );

  
  return (
    <>
      {/* Carousel */}
      <Carousel fade interval={3000} pause={false}>
        <CarouselItem>
          <img
            className="d-block w-100"
            src="/assets/banner/banner1.png"
            alt="Slide 1"
            style={{ height: "70vh", objectFit: "cover" }}
          />
          <CarouselCaption>
            <h3>Royal Restaurant 👑</h3>
            <p>Exquisite cuisine, elegant ambiance..</p>
          </CarouselCaption>
        </CarouselItem>

        <CarouselItem>
          <img
            className="d-block w-100"
            src="/assets/banner/banner2.png"
            alt="Slide 2"
            style={{ height: "70vh", objectFit: "cover" }}
          />
          <CarouselCaption>
            <h3>Premium taste</h3>
            <p>Each dish tells a story.😋</p>
          </CarouselCaption>
        </CarouselItem>

        <CarouselItem>
          <img
            className="d-block w-100"
            src="/assets/banner/banner3.png"
            alt="Slide 3"
            style={{ height: "70vh", objectFit: "cover" }}
          />
          <CarouselCaption>
            <h3>A unique experience</h3>
            <p>Nestled in the heart of the city 🌆</p>
          </CarouselCaption>
        </CarouselItem>
      </Carousel>


      <main className="py-5">
        {/* HÀNG 1: COMBO & KHUYẾN MÃI */}
        <section className="promo-section bg-light py-5 mb-5">
          <ProductSection title="🔥 COMBO HOT PROMOTION" data={comboData} productType="pizza" />
        </section>
        
        {/* HÀNG 2: PIZZA */}
        <section className="mb-5">
          <ProductSection title="🍕 PIZZA HOT" data={pizzaData} productType="pizza" />
        </section>

        {/* HÀNG 3: MÌ Ý (PASTA) */}
        <section className="mb-5">
          <ProductSection title="🍝 PASTA NOODLE" data={pastaData} productType="noodle" />
        </section>

        {/* HÀNG 4: THỨC UỐNG */}
        <section className="mb-5">
          <ProductSection title="🥤 DRINKING WATER" data={drinkData} productType="drinking water" />
        </section>
      </main>
    </>
  );
}
