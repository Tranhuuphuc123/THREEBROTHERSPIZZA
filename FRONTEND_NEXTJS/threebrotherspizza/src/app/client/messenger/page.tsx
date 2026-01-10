"use client";

import { Container, Row, Col, Button } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCommentDots, faQrcode } from "@fortawesome/free-solid-svg-icons";

export default function MessengerPage() {
  return (
    <div className="messenger-wrapper" style={{ marginBottom: "250px" , marginTop: "200px"}}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center">
            {/* Back Button */}
            <div className="text-start mb-4">
              <Link href="/client" passHref legacyBehavior>
                <Button variant="outline-primary" className="rounded-pill px-4">
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                </Button>
              </Link>
            </div>

            {/* Main Content Card */}
            <div className="main-card shadow-lg p-4 p-md-5 bg-white rounded-4">
              <div className="header mb-4">
                <div className="icon-badge mb-3">
                  <FontAwesomeIcon icon={faCommentDots} size="2x" className="text-primary" />
                </div>
                <h1 className="fs-2 fw-bold text-dark mb-2">Connect via Zalo</h1>
                <p className="text-muted">Scan the QR code below to start chatting with us</p>
              </div>

              {/* QR Code Section */}
              <div className="qr-section mb-4">
                <div className="qr-wrapper p-3 border border-2 border-primary rounded-4 d-inline-block bg-white">
                  <Image
                    src="/assets/qrchat/qrchat.jpg"
                    alt="Zalo QR Code"
                    width={300}
                    height={300}
                    className="img-fluid rounded-3"
                    priority
                  />
                </div>
              </div>

              <div className="action-link mb-5">
                <p className="text-muted">
                  Can't scan the code? <br />
                  <Link
                    href="/assets/qrchat/qrchat.jpg" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary fw-bold text-decoration-none border-bottom border-primary"
                  >
                    Click here to chat directly
                </Link>
                </p>
              </div>

              {/* Instructions */}
              <div className="instructions text-start p-4 bg-light rounded-4">
                <h3 className="fs-5 fw-bold mb-3">
                  <FontAwesomeIcon icon={faQrcode} className="me-2" />
                  How to connect:
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">1️⃣ Open <strong>Zalo</strong> app on your phone</li>
                  <li className="mb-2">2️⃣ Select the <strong>QR Code Scanner</strong> icon</li>
                  <li className="mb-2">3️⃣ Point your camera at the QR code above</li>
                  <li>4️⃣ Tap <strong>Follow</strong> and start chatting! 💬</li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .messenger-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        .main-card {
          transition: transform 0.3s ease;
        }
        .icon-badge {
          width: 60px;
          height: 60px;
          background: #e7f1ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        .qr-wrapper {
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 123, 255, 0.15);
        }
        .qr-wrapper:hover {
          transform: scale(1.02);
        }
        .instructions ul li {
          font-size: 0.95rem;
          color: #444;
        }
        @media (max-width: 576px) {
          .fs-2 { font-size: 1.5rem !important; }
          .main-card { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}