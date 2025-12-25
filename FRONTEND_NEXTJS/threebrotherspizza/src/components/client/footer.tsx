import Link from "next/link";
import { Col, Container, Image, Row } from "react-bootstrap";

export default function Footer() {
  return (
    <>
      <footer
        className="mt-auto  text-start text-white"
        style={{
          backgroundColor: "#01100B",
          paddingTop: "300px",
          paddingBottom: "30px",
        }}
      >
        <Container className="pt-5">
          <Row>
            {/* TOP SHELF */}
            <Col lg={4}>
              <h1 className="mb-4">THREE BROTHER PIZZA</h1>
              <p className="w-75 lh-lg" style={{ color: "#9D9EA2" }}>
                <Image src= "/assets/admin/img/threebrotherpizzalogo.jpg" width={300} height={300} />
              </p>
            </Col>
            {/* QUICK LINK, CONTACT US, MORE */}
            <Col lg={8}>
              <h2 className="mb-4">ABOUT</h2>
              <Row style={{ color: "#9D9EA2" }}>
                <Col lg={6} className="d-flex flex-column gap-3">
                  <span>Hệ thống cửa hàng</span>
                  <span>Câu chuyện thương hiệu</span>
                </Col>
                <Col lg={6} className="d-flex flex-column gap-3">
                   <span>Tin tức và sự kiện</span>
                  <span>Tuyển dụng</span>
                </Col>
              </Row>
              <h2 className="my-4">CONTACT US</h2>
              <Row style={{ color: "#9D9EA2" }}>
                <Col lg={6} className="d-flex flex-column gap-3">
                  <span>Hướng dẫn mua hàng</span>
                  <span>Chính sách giao hàng</span>
                </Col>
                <Col lg={6} className="d-flex flex-column gap-3">
                  <span>Chính sách bảo mật</span>
                  <span>Điều khiển và điều kiện</span>
                </Col>
              </Row>
              <h2 className="my-4">ADDRESS STORE</h2>
              <Row style={{ color: "#9D9EA2" }}>
                <Col className="d-flex flex-column gap-3">
                  <span>Buy weed online in Canada</span>
                </Col>
              </Row>
              <h2 className="my-4">TỔNG ĐÀI HỖ TRỢ</h2>
              <Row style={{ color: "#9D9EA2" }}>
                <Col className="d-flex flex-column gap-3">
                  <span>Đặt hàng: 19001577(9:30 - 21:00)</span>
                  <span>CSKH: 1900(9:30 - 21:00)</span>
                </Col>
              </Row>
              
            </Col>
          </Row>

          {/* copy right bootom footer */}
          <hr className="my-4 border-white opacity-50" />
          <Container
            style={{ color: "#9D9EA2" }}
            className="d-flex justify-content-between"
          >
            {/* Nội dung bên trái */}
            <p className="pt-3">Bản quyền © 2025 The Threebrotherpizza. Đã đăng ký bản quyền.</p>
          </Container>
        </Container>
      </footer>
    </>
  );
}
