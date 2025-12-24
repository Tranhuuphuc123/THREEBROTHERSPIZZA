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
  Col,
  Container,
  Row,
  Image,
  Tabs,
  Tab,
  Card,
  Button,
} from "react-bootstrap";
import CarouselItem from "react-bootstrap/CarouselItem";
import CarouselCaption from "react-bootstrap/CarouselCaption";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";
import SwiperProduct from "@/components/client/swiperproduct";
import Link from "next/link";
import ChooseProduct from "@/components/client/chooseproduct";
import Referfriendbanner from "@/components/client/referfriendbanner";
import SwiperEducation from "@/components/client/swipereducation";
import OrderBanner from "@/components/client/orderbanner";
import BackToTop from "@/components/client/BackToTop";

/* phan body cua homepage cuar client page layout */
export default function HomePage() {
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

      {/* Banner */}
      <section
        className="text-center text-white py-5"
        style={{
          backgroundImage:
            'url("https://thepizzacompany.vn/images/thumbs/000/0004572_1200x480-(T12)%20(1).png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(5, 66, 44, 0.8)", // overlay tím royal mờ mờ
        }}
      >
        <div className="container">
          <h1 className="fw-bold display-5 text-warning">
            ✨ Royal Kingdom of Devs ✨
          </h1>
          <p className="lead mb-4">
            bánh pizza ngon hết xẩy💫
          </p>
          <a href="/about" className="btn btn-warning fw-semibold">
            Khám phá ngay 💎
          </a>
        </div>
      </section>

      {/* phan body  */}
      <main className=" my-5 flex-grow-1 ">
        {/* */}

        {/*phần reliable shipping */}
        <Container
          fluid
          style={{ backgroundColor: "#F2F6F4" }}
          className="my-5 py-5 px-5"
        >
          <Row className="text-start py-4">
            <Col lg={4} md={6} className="d-flex align-items-start">
              <Image src="/globe.svg" width={40} height={40} className="me-5" />
              <div>
                <h5 className="fw-bold mb-4 ">Reliable Shipping</h5>
                <p className="text-muted fs-6 fw-semi-bold">
                  Green Society provides Canada Post Xpress Shipping right to
                  your doorstep! You can also opt in for shipping insurance. For
                  orders over $149, shipping is free!
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="d-flex align-items-start">
              <Image
                src="/window.svg"
                width={40}
                height={40}
                className="me-5"
              />
              <div>
                <h5 className="fw-bold mb-4 ">You’re Safe With Us</h5>
                <p className="text-muted fs-6 fw-semi-bold">
                  Our secure payment system accepts the most common forms of
                  payments making the checkout process quicker! The payments we
                  accept are debit, all major credit cards, and cryptocurrency.
                </p>
              </div>
            </Col>
            <Col lg={4} md={6} className="d-flex align-items-start">
              <Image src="/file.svg" width={40} height={40} className="me-5" />
              <div>
                <h5 className="fw-bold mb-4 ">Best Quality & Pricing</h5>
                <p className="text-muted fs-6 fw-semi-bold">
                  Here at Green Society, we take pride in the quality of our
                  products and service. Our prices are set to ensure you receive
                  your medication at a reasonable price and safely
                </p>
              </div>
            </Col>
          </Row>
        </Container>

        {/* BEST DISPENSARY TO BUY WEED ONLINE IN CANADA */}

        <Container className="text-center my-5 d-flex flex-column align-items-center">
          <h1
            className="text-center fw-bold w-75 mt-5"
            style={{ fontSize: "40px" }}
          >
            BEST DISPENSARY TO BUY WEED ONLINE IN CANADA
          </h1>

          {/* Tabs  */}
          <Tabs
            defaultActiveKey="bestsaller"
            id="uncontrolled-tab-example"
            className="my-5 custom-tabs w-100"
          >
            <Tab eventKey="bestsaller" title="Best Sellers">
              <Row>
                <Col lg={4} className="">
                  <Card
                    className="d-flex align-items-center border h-100"
                    style={{ backgroundColor: "#114B36" }}
                  >
                    <Card.Img
                      className="mt-5"
                      variant="top"
                      style={{
                        width: "120px",
                        height: "120px",
                      }}
                      src="/products/product_1.png"
                    />
                    <Card.Body className="text-white text-center mx-5 mt-3 mb-5">
                      <Card.Title className="fw-bold fs-4">
                        Shop our Best Sellers
                      </Card.Title>
                      <Card.Text className=" fs-6 fw-lighter mx-3">
                        Lorem ipsum dolor sit amet consectetur. Ullamcorper
                        ipsum varius lorem blandit lectus magnis feugiat.
                      </Card.Text>
                      <Link
                        className="text-decoration-underline"
                        style={{ color: "#17AF26" }}
                        href="#"
                      >
                        View All
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={8}>
                  <SwiperProduct></SwiperProduct>
                </Col>
              </Row>
            </Tab>
            <Tab eventKey="bundles" title="Bundles & Promotions">
              Tab content for Profile
            </Tab>
            <Tab eventKey="onsale" title="On Sale">
              Tab content for Contact
            </Tab>
          </Tabs>
        </Container>

        {/* choose your weed */}
        <Container className="text-start py-5">
          <h1
            className="text-start fw-bold w-75 py-5"
            style={{ fontSize: "40px" }}
          >
            CHOOSE YOUR WEED
          </h1>

          {/* tab */}
          <div>
            <h5 className="pe-4 mb-1 fw-semibold ">Filter by Interest</h5>
            <div>
              <Tabs
                defaultActiveKey="flowers"
                id="uncontrolled-tab-example"
                className="w-75 "
              >
                <Tab eventKey="flowers" title="Flowers">
                  <ChooseProduct></ChooseProduct>
                </Tab>
                <Tab eventKey="mushrooms" title="Mushrooms">
                  <ChooseProduct></ChooseProduct>
                </Tab>
                <Tab eventKey="concentrate" title="Concentrate">
                  <ChooseProduct></ChooseProduct>
                </Tab>
                <Tab eventKey="edibles" title="Edibles">
                  <ChooseProduct></ChooseProduct>
                </Tab>
                <Tab eventKey="shopallweed" title="Shop All Weed">
                  <ChooseProduct></ChooseProduct>
                </Tab>
              </Tabs>
            </div>
          </div>
        </Container>

        {/* refer friend banner */}
        <Referfriendbanner></Referfriendbanner>

        {/* HOW TO ORDER WEED ONLINE FROM TOP SHELF BC - MAIL ORDER MARIJUANA */}

        <Container
          fluid
          style={{ backgroundColor: "#01100B", paddingTop: "200px" }}
          className="my-5 d-flex flex-column align-items-center"
        >
          <h1
            className="text-white fw-bold fs-1 text-center py-5  w-50 mx-auto"
            style={{ paddingTop: "300px" }}
          >
            HOW TO ORDER WEED ONLINE FROM TOP SHELF BC - MAIL ORDER MARIJUANA
          </h1>
          <p
            className=" w-50 text-center m-auto  pb-5"
            style={{ color: "#9D9EA2" }}
          >
            Ordering weed online from Top Shelf BC is easy. We are proud to have
            made the process accessible across multiple platforms and simple to
            understand, meaning that more people can come to us to buy their
            cannabis products online.
          </p>

          <Container>
            <Row className="text-center ">
              <Col xl={6}>
                <div className=" position-relative d-inline-block mb-5">
                  {/* Số 1: Đặt vị trí tuyệt đối */}
                  <span
                    className=" position-absolute rounded-circle fs-4"
                    style={{
                      backgroundColor: "#F2BC1B",
                      width: "50px",
                      height: "50px",
                      top: "-40px",
                      left: "-80px",
                      color: "black",
                      fontWeight: "bold",
                      lineHeight: "50px",
                    }}
                  >
                    1
                  </span>
                </div>
                <Image src="/file.svg" width={80} height={80} />
                <h5 className="text-white my-5 fw-semibold ">REGISTER</h5>
                <p className=" text-center   pb-5" style={{ color: "#9D9EA2" }}>
                  Sign up for an account with us. This is quick and simple. We
                  don’t require any more details from you than the bare minimum
                  needed for you to place an order and get your product
                  delivered.
                </p>
              </Col>
              <Col xl={6}>
                <div className=" position-relative d-inline-block mb-5">
                  {/* Số 1: Đặt vị trí tuyệt đối */}
                  <span
                    className=" position-absolute rounded-circle fs-4"
                    style={{
                      backgroundColor: "#F2BC1B",
                      width: "50px",
                      height: "50px",
                      top: "-40px",
                      left: "-80px",
                      color: "black",
                      fontWeight: "bold",
                      lineHeight: "50px",
                    }}
                  >
                    2
                  </span>
                </div>
                <Image src="/globe.svg" width={80} height={80} />
                <h5 className="text-white my-5 fw-semibold ">SHOP</h5>
                <p
                  className=" text-center m-auto  pb-5"
                  style={{ color: "#9D9EA2" }}
                >
                  Decide on what you want to purchase. We stock a wide range of
                  edibles,flowers , concentrates and mushrooms there is bound to
                  be something for everyone.
                </p>
              </Col>
              <Col xl={6}>
                <div className=" position-relative d-inline-block mb-5">
                  {/* Số 1: Đặt vị trí tuyệt đối */}
                  <span
                    className=" position-absolute rounded-circle fs-4"
                    style={{
                      backgroundColor: "#F2BC1B",
                      width: "50px",
                      height: "50px",
                      top: "-40px",
                      left: "-80px",
                      color: "black",
                      fontWeight: "bold",
                      lineHeight: "50px",
                    }}
                  >
                    3
                  </span>
                </div>
                <Image src="/vercel.svg" width={80} height={80} />
                <h5 className="text-white my-5 fw-semibold ">MAKE PAYMENT</h5>
                <p
                  className=" text-center m-auto  pb-5"
                  style={{ color: "#9D9EA2" }}
                >
                  Pay securely. Our site boasts sturdy protection certificates
                  to keep your card details and related data safe.
                </p>
              </Col>
              <Col xl={6}>
                <div className=" position-relative d-inline-block mb-5">
                  {/* Số 1: Đặt vị trí tuyệt đối */}
                  <span
                    className=" position-absolute rounded-circle fs-4"
                    style={{
                      backgroundColor: "#F2BC1B",
                      width: "50px",
                      height: "50px",
                      top: "-40px",
                      left: "-80px",
                      color: "black",
                      fontWeight: "bold",
                      lineHeight: "50px",
                    }}
                  >
                    4
                  </span>
                </div>
                <Image src="/window.svg" width={80} height={80} />
                <h5 className="text-white my-5 fw-semibold ">RELAX</h5>
                <p
                  className=" text-center m-auto  pb-5"
                  style={{ color: "#9D9EA2" }}
                >
                  Your product will be packaged discretely and shipped by Canada
                  Post Xpresspost. We will provide you with a tracking number so
                  then you can follow your mail order marijuana every step of
                  the way.
                </p>
              </Col>
            </Row>
          </Container>

          {/* button choose ur weed */}
          <Button className="btn-success text-light py-3 px-5 rounded-pill my-5">
            Choose Your Weed
          </Button>
        </Container>

        {/* Weed education */}
        <Container className="my-5 py-5" style={{ backgroundColor: "f4f4f4" }}>
          <div className="d-flex align-items-start">
            <h2 className="fw-bold">WEED EDUCATION</h2>
            <Link
              style={{ color: "#4ec059" }}
              href="#"
              className=" ms-auto text-decoration-underline fw-semibold"
            >
              Show All
            </Link>
          </div>
          <hr className=" mb-5 border-secondary opacity-50 pb-4"></hr>

          <SwiperEducation></SwiperEducation>
        </Container>

        {/* banner order */}
        <OrderBanner></OrderBanner>
      </main>
    </>
  );
}
