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

/* phan body cua homepage cuar client page layout */
export default function HomePage() {

  // Giả lập dữ liệu cho từng nhóm sản phẩm
  const comboData = [
    { id: 101, name: "Combo Gia Đình 1", description: "1 Pizza L, 1 Mì Ý, 4 Nước ngọt", price: "399.000đ", image: "/assets/client/img/combo/combo1.png", tag: "Hot" },
    { id: 102, name: "Combo Bạn Bè", description: "2 Pizza M, 1 Khoai tây chiên", price: "299.000đ", image: "/assets/client/img/combo/combo2.jpg" },
    { id: 103, name: "Combo Tiết Kiệm", description: "1 Pizza M, 2 Nước ngọt", price: "199.000đ", image: "/assets/client/img/combo/combo2.jpg" },
    { id: 104, name: "Combo Độc Thân", description: "1 Pizza S, 1 Nước ngọt", price: "129.000đ", image: "/assets/client/img/combo/combo3.jpg" },
  ];

  const pizzaData = [
    { id: 1, name: "Pizza Hải Sản Đào", description: "Tôm, thanh cua, xốt xào Đào...", price: "179.000đ", image: "/assets/client/img/pizzaCake/cheese.jpg", tag: "Mới" },
    { id: 2, name: "Pizza 4 Cheese", description: "4 loại phô mai hảo hạng...", price: "169.000đ", image: "/assets/client/img/pizzaCake/pepperoni.jpg" },
    { id: 3, name: "Pizza Xúc Xích", description: "Xúc xích Pepperoni đậm đà...", price: "159.000đ", image: "/assets/client/img/pizzaCake/cheese.jpg" },
    { id: 4, name: "Pizza Rau Củ", description: "Nấm, ớt chuông, cà chua...", price: "149.000đ", image: "/assets/client/img/pizzaCake/seafoodpizza_shrimp.jpg" },
  ];

  // Render Section Helper để code ngắn gọn
  const ProductSection = ({ title, data }: { title: string, data: any[] }) => (
    <Container className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <h2 className="fs-3 fw-bold text-dark mb-0">{title}</h2>
        <Link href="/client/products" passHref>
          <Button variant="link" className="text-danger fw-bold text-decoration-none">
            View All
          </Button>
        </Link>
      </div>
      <Row className="g-4">
        {data.map((item) => (
          <ProductCard key={item.id} data={item} />
        ))}
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
            src="https://thepizzacompany.vn/images/thumbs/000/0004542_TPC_Digital_LTO_4CHEESExCoconut%20copy_Website_Banner%20Slider_W1200%20x%20H480%20px.png"
            alt="Slide 1"
            style={{ height: "70vh", objectFit: "cover" }}
          />
          <CarouselCaption>
            <h3>Hoàng Gia Restaurant 👑</h3>
            <p>Ẩm thực tinh tế, không gian sang trọng.</p>
          </CarouselCaption>
        </CarouselItem>

        <CarouselItem>
          <img
            className="d-block w-100"
            src="https://thepizzacompany.vn/images/thumbs/000/0004335_TPC_WEBSITE_DIGITAL-COMBO-ECOM-AWO-2025_1200x480px.jpeg"
            alt="Slide 2"
            style={{ height: "70vh", objectFit: "cover" }}
          />
          <CarouselCaption>
            <h3>Hương vị đẳng cấp</h3>
            <p>Mỗi món ăn là một câu chuyện 😋</p>
          </CarouselCaption>
        </CarouselItem>

        <CarouselItem>
          <img
            className="d-block w-100"
            src="https://thepizzacompany.vn/images/thumbs/000/0004514_TPC_LTO%20PESTO-DISAN_BannerWeb_1200x480px.png"
            alt="Slide 3"
            style={{ height: "70vh", objectFit: "cover" }}
          />
          <CarouselCaption>
            <h3>Trải nghiệm đặc biệt</h3>
            <p>Ẩn mình giữa lòng thành phố 🌆</p>
          </CarouselCaption>
        </CarouselItem>
      </Carousel>


      <main className="py-5">
        {/* HÀNG 1: COMBO & KHUYẾN MÃI */}
        <section className="promo-section bg-light py-5 mb-5">
            <ProductSection title="🔥 COMBO KHUYẾN MÃI" data={comboData} />
        </section>

        {/* HÀNG 2: PIZZA */}
        <section className="mb-5">
            <ProductSection title="🍕 PIZZA NÓNG HỔI" data={pizzaData} />
        </section>

        {/* HÀNG 3: MÌ Ý (PASTA) */}
        <section className="mb-5">
            {/* Truyền dữ liệu mì ý vào đây (tạm dùng pizzaData để demo) */}
            <ProductSection title="🍝 MÌ Ý & CƠM" data={pizzaData.slice(0, 4)} />
        </section>

        {/* HÀNG 4: THỨC UỐNG */}
        <section className="mb-5">
             <ProductSection title="🥤 THỨC UỐNG" data={pizzaData.slice(0, 4)} />
        </section>
      </main>
    </>
  );
}
