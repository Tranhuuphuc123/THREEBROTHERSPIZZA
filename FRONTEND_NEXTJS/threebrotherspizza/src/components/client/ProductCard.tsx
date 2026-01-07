"use client";
import { Col, Card, Button, Image } from "react-bootstrap";

interface PizzaProps {
  data: {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    tag?: string;
  };
}

export function ProductCard({ data }: PizzaProps) {
  return (
    <Col xs={12} sm={6} lg={3}>
      {/* Sử dụng className "pizza-card-custom" để định nghĩa trong thẻ style bên dưới 
      */}
      <Card className="pizza-card-custom h-100 border-0 shadow-sm position-relative">
        {/* Badge Tag */}
        {data.tag && (
          <div className="position-absolute top-0 end-0 m-3 z-1">
            <small className="text-success fw-bold d-flex align-items-center bg-white px-2 py-1 rounded shadow-sm" style={{ fontSize: '10px' }}>
              <i className="bi bi-star-fill me-1 text-warning"></i> PIZZA {data.tag}
            </small>
          </div>
        )}

        {/* Hình ảnh */}
        <div className="p-3 text-center">
          <Image
            src={data.image}
            alt={data.name}
            className="img-fluid transition-scale-custom"
            style={{ maxHeight: "200px", objectFit: "contain" }}
          />
        </div>

        {/* Nội dung Card */}
        <Card.Body className="d-flex flex-column pt-0">
          <Card.Title className="card-title-custom fs-6 fw-bold text-dark mb-2">
            {data.name}
          </Card.Title>

          <Card.Text className="text-muted mb-4" style={{ fontSize: "13px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {data.description}
          </Card.Text>

          {/* Giá và Nút bấm */}
          <div className="mt-auto d-flex justify-content-between align-items-end">
            <div>
              <div className="text-muted small" style={{ fontSize: '11px' }}>Giá chỉ từ</div>
              <div className="fw-bold fs-5 text-dark" style={{ color: '#212529' }}>{data.price}</div>
            </div>

            <Button
              variant="outline-success"
              className="rounded-pill px-3 py-1 fw-bold d-flex align-items-center"
              style={{ fontSize: '13px', borderWidth: '2px' }}
            >
              Mua ngay <i className="bi bi-arrow-right-short fs-5 ms-1"></i>
            </Button>
          </div>
        </Card.Body>

        {/* Nhúng CSS trực tiếp vào Component 
            Dùng kiểu này giúp bạn không cần file .css riêng mà vẫn có Hover hiệu ứng
        */}
        <style jsx global>{`
          .pizza-card-custom {
            transition: transform 0.3s ease !important;
            border: none !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
          }

          .pizza-card-custom:hover {
            transform: translateY(-5px) !important;
          }

          .transition-scale-custom {
            transition: transform 0.3s ease !important;
          }

          .pizza-card-custom:hover .transition-scale-custom {
            transform: scale(1.05) !important;
          }

          .card-title-custom {
            line-height: 1.4 !important;
            min-height: 2.8rem !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }

          /* Màu đỏ thương hiệu cho các phần khác nếu cần */
          .text-danger-pizza {
            color: #e31837 !important;
          }
          .bg-danger-pizza {
            background-color: #e31837 !important;
          }
        `}</style>
      </Card>
    </Col>
  );
}