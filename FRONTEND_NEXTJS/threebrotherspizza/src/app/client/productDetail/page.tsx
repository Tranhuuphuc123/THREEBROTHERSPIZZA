"use client";
import Image from "next/image";

const PizzaProductDetails = () => {
  return (
    // Sử dụng paddingBottom thay vì marginBottom để màu nền bg-light kéo dài hết khoảng trống
    <div className="bg-light min-vh-100 py-5" style={{ marginBottom: '150px' }}>
      <div className="container">
        <div className="row g-4">
          
          {/* CỘT TRÁI: HÌNH ẢNH & REVIEW */}
          <div className="col-lg-7">
            {/* Box Hình Ảnh Chính & Thumbs */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
              {/* Ảnh lớn */}
              <div className="text-center mb-4">
                <div className="main-img-wrapper p-3 border rounded-4 bg-light">
                  <Image
                    src="/assets/client/img/pizza-rau-cu.png" 
                    alt="Pizza Rau Củ"
                    className="img-fluid"
                    width={450}
                    height={450}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              
              {/* 4 Ảnh con bên dưới */}
              <div className="row g-2 justify-content-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-3 col-md-2">
                    <div className="thumb-item border rounded-3 p-1 cursor-pointer overflow-hidden shadow-sm hover-border-success">
                      <Image
                        src={`/assets/client/img/anhtemp/e-${i}.jpg`}
                        className="img-fluid rounded-2"
                        alt={`Thumb ${i}`}
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box Đánh giá */}
            <div className="bg-white p-4 rounded-4 shadow-sm">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <i className="fa-solid fa-star text-warning me-2"></i>
                Đánh giá từ khách hàng
              </h5>
              <div className="review-list">
                <div className="d-flex gap-3 border-bottom pb-3 mb-3">
                  <div className="avatar bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: 45, height: 45, flexShrink: 0}}>M</div>
                  <div>
                    <div className="fw-bold">Nguyễn Văn Mạnh</div>
                    <div className="text-warning small mb-1">★★★★★</div>
                    <p className="text-secondary small mb-0">Pizza nhiều phô mai, rau củ tươi xanh, ăn không bị ngán. Sẽ đặt lại!</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-light p-3 rounded-4">
                <label className="fw-bold small mb-2 text-dark">Gửi nhận xét của bạn</label>
                <textarea className="form-control border-0 mb-2" rows="2" placeholder="Cảm nhận của bạn về món ăn này..."></textarea>
                <button className="btn btn-success btn-sm px-4 rounded-pill fw-bold">Gửi đánh giá</button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN & TÍNH TIỀN (STAY FIXED) */}
          <div className="col-lg-5">
            {/* Loại bỏ các hiệu ứng trôi nổi, chỉ dùng sticky-top để đi theo khi cuộn */}
            <div className="bg-white p-4 rounded-4 shadow-sm border border-success-subtle sticky-top" style={{ top: '20px', zIndex: 10 }}>
              <div className="mb-3">
                <div className="badge bg-success mb-2 px-3 py-2 rounded-pill">Món ăn phổ biến</div>
                <h1 className="fw-bold h2 text-dark mb-1">Pizza Rau Củ</h1>
                <p className="text-muted small">Hành tây, ớt chuông, nấm ống, dứa tươi và cà chua chín mọng trộn cùng phô mai Mozzarella.</p>
              </div>

              <hr className="opacity-10" />

              {/* 1. Chọn kích thước */}
              <div className="mb-4">
                <label className="fw-bold small mb-3 text-uppercase d-flex align-items-center">
                    <span className="bg-success text-white rounded-circle me-2 d-inline-flex justify-content-center align-items-center" style={{width:20, height:20, fontSize:10}}>1</span>
                    Chọn kích thước
                </label>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-success flex-fill active py-2 border-2">
                    <div className="fw-bold">Nhỏ 6"</div>
                  </button>
                  <button className="btn btn-outline-success flex-fill py-2 border-2">
                    <div className="fw-bold">Vừa 9"</div>
                    <div className="small text-success">+80k</div>
                  </button>
                  <button className="btn btn-outline-success flex-fill py-2 border-2">
                    <div className="fw-bold">Lớn 12"</div>
                    <div className="small text-success">+190k</div>
                  </button>
                </div>
              </div>

              {/* 2. Chọn đế */}
              <div className="mb-4">
                <label className="fw-bold small mb-3 text-uppercase d-flex align-items-center">
                    <span className="bg-success text-white rounded-circle me-2 d-inline-flex justify-content-center align-items-center" style={{width:20, height:20, fontSize:10}}>2</span>
                    Chọn loại đế
                </label>
                <select className="form-select border-2 py-2 border-success-subtle rounded-3">
                  <option>Đế Dày Giòn truyền thống</option>
                  <option>Đế Mỏng Giòn rụm</option>
                  <option>Đế Viền Phô Mai (+50k)</option>
                </select>
              </div>

              {/* 3. Ghi chú */}
              <div className="mb-4">
                <label className="fw-bold small mb-2 text-uppercase text-secondary">Ghi chú thêm</label>
                <textarea className="form-control rounded-3 bg-light border-0" rows="2" placeholder="Ví dụ: Cắt làm 8 miếng, không lấy dứa..."></textarea>
              </div>

              {/* Phần Tổng kết & Nút bấm */}
              <div className="pt-3 border-top mt-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <span className="fw-bold text-secondary">Tổng thanh toán:</span>
                  <div className="text-end">
                    <span className="h2 fw-bold text-danger mb-0">139.000đ</span>
                  </div>
                </div>
                <button className="btn btn-success w-100 py-3 fw-bold fs-5 shadow rounded-3 text-uppercase">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .cursor-pointer { cursor: pointer; }
        .hover-border-success:hover {
            border-color: #198754 !important;
            transition: 0.3s;
        }
        .btn-outline-success.active {
            background-color: #e8f5e9;
            color: #198754;
        }
      `}</style>
    </div>
  );
};

export default PizzaProductDetails;