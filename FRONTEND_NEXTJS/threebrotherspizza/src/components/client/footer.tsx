import Link from "next/link";
import { Col, Container, Image, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer
      className="text-white"
      style={{
        backgroundColor: "#05422C", // Màu xanh lá đặc trưng như trong hình
        paddingTop: "60px",
        paddingBottom: "40px",
        fontSize: "0.95rem"
      }}
    >
      <Container>
        <Row className="gy-4">
          {/* CỘT 1: LOGO & HOTLINE GIỐNG HÌNH MẪU */}
          <Col lg={3} md={6}>
            <div className="text-center text-md-start">
              <Image 
                src="/assets/admin/img/threebrotherpizzalogo.jpg" 
                alt="Logo" 
                roundedCircle
                style={{ width: "120px", height: "120px", border: "4px solid white", marginBottom: "20px" }}
              />
              <div className="d-flex align-items-center justify-content-center justify-content-md-start mt-2">
                 <div style={{ borderBottom: "2px solid white", width: "40px" }}></div>
                 <FontAwesomeIcon icon={faPhoneVolume} className="mx-2 fs-4" />
                 <div style={{ borderBottom: "2px solid white", width: "40px" }}></div>
              </div>
              <h2 className="fw-bold mt-2 mb-0" style={{ fontSize: "2.5rem" }}>1900 6066</h2>
              <p className="text-uppercase fw-bold" style={{ letterSpacing: "2px", fontSize: "0.8rem" }}>Fast Delivery</p>
            </div>
          </Col>

          {/* CỘT 2: INTRODUCTION (GIỚI THIỆU) */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold text-uppercase mb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 2 }}>Introduction</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Restaurant System</Link></li>
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Brand Story</Link></li>
              <li><Link href="#" className="text-white text-decoration-none opacity-75">News & Events</Link></li>
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Recruitment</Link></li>
            </ul>
            
            <h5 className="fw-bold text-uppercase mt-4 mb-3">Office Address</h5>
            <p className="opacity-75" style={{ fontSize: "0.85rem", lineHeight: "1.6" }}>
              Three Brother Pizza JSC<br />
              77 Tran Nhan Ton, Ward 9, District 5,<br />
              Ho Chi Minh City, Vietnam.
            </p>
          </Col>

          {/* CỘT 3: CONTACT (LIÊN HỆ) */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold text-uppercase mb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 2 }}>Contact Us</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Shopping Guide</Link></li>
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Delivery Policy</Link></li>
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Privacy Policy</Link></li>
              <li><Link href="#" className="text-white text-decoration-none opacity-75">Terms & Conditions</Link></li>
            </ul>

            <h5 className="fw-bold text-uppercase mt-4 mb-3">Customer Support</h5>
            <p className="mb-1 opacity-75">Order: <b>1900 1577</b> (9:30 - 21:30)</p>
            <p className="opacity-75">CSKH: <b>1900 6066</b> (9:30 - 21:30)</p>
          </Col>

          {/* CỘT 4: SOCIAL MEDIA (LIÊN KẾT VỚI CHÚNG TÔI) */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold text-uppercase mb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", pb: 2 }}>Connect With Us</h5>
            <div className="d-flex gap-3 mb-4">
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="social-icon"><FontAwesomeIcon icon={faYoutube} /></a>
            </div>
            
            <div className="mt-4">
               <Image 
                src="https://thepizzacompany.vn/images/certified-bct.png" // Đây là icon "Đã thông báo bộ công thương"
                alt="Verified"
                style={{ width: "150px" }}
               />
            </div>
          </Col>
        </Row>

        <hr className="my-5 border-white opacity-25" />

        <div className="text-center opacity-50" style={{ fontSize: "0.8rem" }}>
          <p>Copyright © 2026 Three Brother Pizza. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}