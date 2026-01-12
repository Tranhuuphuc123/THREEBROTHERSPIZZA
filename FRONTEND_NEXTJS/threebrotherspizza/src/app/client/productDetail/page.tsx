"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axiosClient from "@/axios/axiosAdmin";
import { UPLOAD_URL } from "@/constants/urls";
//improt productDetailTypes cho page productDetail
import {ProductDetailTypes} from '@/types/ProductDetailTypes'

//import useCart từu cartContext để lôi sử dụng các method trong cartProvider
import {useCart} from '@/contexts/cartContext'



const PizzaProductDetails = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  
  //state ghi nhận thông tin sản phẩm
  const [product, setProduct] = useState<ProductDetailTypes | null>(null);
  //state ghi nhận số lượng sản phẩm
  const [quantity, setQuantity] = useState<number>(1);
  //state ghi nhận trạng thái đang load 
  const [loading, setLoading] = useState(true);
  //state ghi nhận trạng thái lỗi
  const [error, setError] = useState<string | null>(null);
  
  // State cho form chọn size và đế
  const [selectedSize, setSelectedSize] = useState("small");
  const [selectedBase, setSelectedBase] = useState("traditional");
  const [note, setNote] = useState("");
  
  // Tính giá dựa trên size
  const sizePrices = {
    small: 0,
    medium: 0.4,
    large: 0.8,
  };
  
  const basePrices = {
    traditional: 0,
    thin: 0,
    cheese: 0.3,
  };
  
  // Lấy giá gốc từ API sản phẩm
  const basePrice = product?.price || 0;
  const sizePrice = sizePrices[selectedSize as keyof typeof sizePrices];
  const basePriceExtra = basePrices[selectedBase as keyof typeof basePrices];
  const totalPrice = basePrice + sizePrice + basePriceExtra;

  //khởi tạo method add đưa sản phẩm từ product detail vào giỏ hàng cart trong tk cartContext
  const {addToCart} = useCart()

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + "đ";
  };

  /*### Method xử lý handleAddToCart###
   => khi chọn poduct add to cart
   => sản phẩm sẽ lây những thông tin cần thiết đổ vào method addTocart con text
   đẻ ghi nhận sản phẩm đã chọn mua add vào cart với các thông tin cần hiển thị
   nhất là số lượng
  */
  const handleAddToCart = (product:ProductDetailTypes) => {
    const newCartItems = {
      id:product?.id,
      name:product?.name,
      image: product?.image,
      price:product?.price,
      quantity: quantity
    }
    //gọi hàm addtocart từ cartContext add các product vào
    addToCart(newCartItems)
  }

  // Gọi API lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Không tìm thấy ID sản phẩm");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosClient.get(`/products/${productId}`);
        
        if (response.data.statuscode === 201 && response.data.data) {
          setProduct(response.data.data);
        } else {
          setError("Không tìm thấy sản phẩm");
        }
      } catch (error: any) {
        console.error("Error fetching product:", error);
        setError(error.response?.data?.msg || "Có lỗi xảy ra khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Xử lý ảnh URL
  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return "/assets/client/img/no_avatar.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return imagePath;
    return `${UPLOAD_URL}/${imagePath}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-5 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Is Loading...</span>
          </div>
          <p className="mt-3 text-muted">Is Loading product information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="bg-light min-vh-100 py-5 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3 text-danger">Not Product found</h3>
          <p className="text-muted">{error || "Sản phẩm không tồn tại hoặc đã bị xóa"}</p>
          <a href="/client" className="btn btn-success mt-3">
            Return Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5" style={{ marginBottom: '650px' }}>
      <div className="container">
        <div className="row g-4">
          
          {/******************CỘT TRÁI: HÌNH ẢNH & REVIEW *******************/}
          <div className="col-lg-7">
            {/* Box Hình Ảnh Chính & Thumbs */}
            <div className="bg-white p-4 rounded-4 shadow-sm mb-4">
              {/* Ảnh lớn - Cố định tỉ lệ */}
              <div className="text-center mb-4">
                <div className="main-img-wrapper p-3 border rounded-4 bg-light" style={{ 
                  aspectRatio: '1 / 1', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  maxWidth: '100%',
                  margin: '0 auto'
                }}>
                  <Image
                    src={getImageUrl(product.image)} 
                    alt={product.name}
                    className="img-fluid"
                    width={450}
                    height={450}
                    style={{ 
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/client/img/no_avatar.jpg";
                    }}
                  />
                </div>
              </div>
              
              {/* 4 Ảnh con bên dưới - Cố định tỉ lệ */}
              <div className="row g-2 justify-content-center">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-3 col-md-2">
                    <div 
                      className="thumb-item border rounded-3 p-1 cursor-pointer overflow-hidden shadow-sm hover-border-success"
                      style={{
                        aspectRatio: '1 / 1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Image
                        src={getImageUrl(product.image)}
                        className="img-fluid rounded-2"
                        alt={`Thumb ${i}`}
                        width={100}
                        height={100}
                        style={{ 
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Box Đánh giá */}
            {/* <div className="bg-white p-4 rounded-4 shadow-sm">
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
                <textarea className="form-control border-0 mb-2" rows={2} placeholder="Cảm nhận của bạn về món ăn này..."></textarea>
                <button className="btn btn-success btn-sm px-4 rounded-pill fw-bold">Gửi đánh giá</button>
              </div>
            </div> */}
          </div>

          {/******************** CỘT PHẢI: THÔNG TIN & TÍNH TIỀN - BỎ STICKY ***************/}
          <div className="col-lg-5">
            {/* Bỏ sticky-top để scroll đồng nhất với bên trái */}
            <div className="bg-white p-4 rounded-4 shadow-sm border border-success-subtle">
              <div className="mb-3">
                {product.isActive === 1 && (
                  <div className="badge bg-success mb-2 px-3 py-2 rounded-pill">Best seller</div>
                )}
                <h1 className="fw-bold h2 text-dark mb-1">{product.name}</h1>
                <p className="text-muted small mb-2">{product.shortDescription || product.description}</p>
                {product.description && product.description !== product.shortDescription && (
                  <p className="text-secondary" style={{ fontSize: '14px' }}>{product.description}</p>
                )}
                <div className="mt-2">
                  <span className="badge bg-secondary me-2">Code: {product.code}</span>
                  <span className="badge bg-info">Type: {product.productType}</span>
                </div>
                {/* Hiển thị giá gốc từ API */}
                <div className="mt-3">
                  <span className="text-muted small">Cross Price: </span>
                  <span className="fw-bold text-success fs-5">{formatPrice(product.price)}</span>
                </div>
              </div>

              <hr className="opacity-10" />

              {/* 1. Chọn kích thước - Chỉ hiện cho Pizza */}
              {product.productType?.toLowerCase().includes("pizza") && (
                <div className="mb-4">
                  <label className="fw-bold small mb-3 text-uppercase d-flex align-items-center">
                    <span className="bg-success text-white rounded-circle me-2 d-inline-flex justify-content-center align-items-center" style={{width:20, height:20, fontSize:10}}>1</span>
                    Select choose size
                  </label>
                  <div className="d-flex gap-2">
                    <button 
                      className={`btn btn-outline-success flex-fill py-2 border-2 ${selectedSize === "small" ? "active" : ""}`}
                      onClick={() => setSelectedSize("small")}
                    >
                      <div className="fw-bold">Small 6"</div>
                      <div className="small text-muted">Cross price</div>
                    </button>
                    <button 
                      className={`btn btn-outline-success flex-fill py-2 border-2 ${selectedSize === "medium" ? "active" : ""}`}
                      onClick={() => setSelectedSize("medium")}
                    >
                      <div className="fw-bold">Medium 9"</div>
                      <div className="small text-success">+{formatPrice(0.80)}</div>
                    </button>
                    <button 
                      className={`btn btn-outline-success flex-fill py-2 border-2 ${selectedSize === "large" ? "active" : ""}`}
                      onClick={() => setSelectedSize("large")}
                    >
                      <div className="fw-bold">Big 12"</div>
                      <div className="small text-success">+{formatPrice(1.20)}</div>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. Chọn đế - Chỉ hiện cho Pizza */}
              {product.productType?.toLowerCase().includes("pizza") && (
                <div className="mb-4">
                  <label className="fw-bold small mb-3 text-uppercase d-flex align-items-center">
                    <span className="bg-success text-white rounded-circle me-2 d-inline-flex justify-content-center align-items-center" style={{width:20, height:20, fontSize:10}}>2</span>
                   Select choose base type
                  </label>
                  <select 
                    className="form-select border-2 py-2 border-success-subtle rounded-3"
                    value={selectedBase}
                    onChange={(e) => setSelectedBase(e.target.value)}
                  >
                    <option value="traditional">Crust Pan</option>
                    <option value="thin">Hand tosse</option>
                  </select>
                </div>
              )}

              {/* 3. nút nhập số lượng */}
              <div className="mb-4">
                <div className="fw-bold mb-1">Quantity: </div>
                <input type="number" 
                        className="form-control w-auto d-inline-block"
                        defaultValue={quantity}
                        min={1}
                        max={100}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>

              {/* 4. Ghi chú */}
              <div className="mb-4">
                <label className="fw-bold small mb-2 text-uppercase text-secondary">Note more</label>
                <textarea 
                  className="form-control rounded-3 bg-light border-0" 
                  rows={2} 
                  placeholder="ex: Cut into 8 pieces, excluding the pineapple..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </div>

              {/*5 Phần Tổng kết giá tiền  & Nút bấm add to cart */}
              <div className="pt-3 border-top mt-4">
                <div className="d-flex justify-content-between align-items-end mb-4">
                  <span className="fw-bold text-secondary">Total Amount:</span>
                  <div className="text-end">
                    <span className="h2 fw-bold text-danger mb-0">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                {/* xử lý add to cart khi nhấn button add to cart với hàm method addToCart 
                từ cartContext */}
                <button className="btn btn-success w-100 py-3 fw-bold fs-5 shadow rounded-3 text-uppercase"
                onClick={() =>handleAddToCart(product)}>
                  Add to cart
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
        /* Đảm bảo ảnh giữ tỉ lệ */
        .main-img-wrapper img {
          object-fit: contain !important;
        }
        .thumb-item img {
          object-fit: cover !important;
        }
      `}</style>
    </div>
  );
};

export default PizzaProductDetails;