"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useCart } from '@/contexts/cartContext'; 
import { useRouter } from "next/navigation";
import { UPLOAD_URL } from "@/constants/urls";

const Payment = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const router = useRouter();

  const [isSuccess, setIsSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    deliveryType: "Home Delivery", // State cho hình thức giao hàng
    paymentMethod: "COD"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    setIsSuccess(true);
  };

  const finishOrder = () => {
    if (clearCart) clearCart();
    router.push("/");
  };

  if (isSuccess) {
    return (
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-9 bg-white p-5 rounded shadow-sm border">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "5rem" }}></i>
              <h2 className="fw-bold mt-3 text-uppercase text-success">Order Successful!</h2>
              <p className="text-muted text-uppercase fw-bold small">Mã đơn hàng: #PIZZA-{Math.floor(Math.random() * 10000)}</p>
            </div>

            <div className="row text-start mb-4">
               <div className="col-md-4 mb-3">
                  <div className="bg-light p-3 rounded border h-100">
                    <h6 className="fw-bold border-bottom pb-2 mb-2 small text-uppercase">Customer</h6>
                    <p className="mb-1 small"><strong>{customerInfo.fullName}</strong></p>
                    <p className="mb-1 small">{customerInfo.phone}</p>
                    <p className="mb-1 small text-muted">{customerInfo.address}</p>
                  </div>
               </div>
               <div className="col-md-4 mb-3">
                  <div className="bg-light p-3 rounded border h-100">
                    <h6 className="fw-bold border-bottom pb-2 mb-2 small text-uppercase">Shipping</h6>
                    <p className="mb-1 small"><strong>Method:</strong> {customerInfo.deliveryType}</p>
                    <p className="mb-1 small"><strong>Fee:</strong> Free</p>
                  </div>
               </div>
               {/* <div className="col-md-4 mb-3">
                  <div className="bg-light p-3 rounded border h-100">
                    <h6 className="fw-bold border-bottom pb-2 mb-2 small text-uppercase">Payment</h6>
                    <p className="mb-1 small"><strong>Method:</strong> {customerInfo.paymentMethod}</p>
                    <p className="mb-1 small text-danger"><strong>Status:</strong> Pending</p>
                  </div>
               </div> */}
            </div>

            <div className="text-start mb-4">
              <h5 className="fw-bold border-bottom pb-2 mb-3 text-uppercase small">Items Purchased</h5>
              {cartItems.map((item: any, idx: number) => (
                <div key={idx} className="d-flex justify-content-between mb-2 small">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{(item.price * item.quantity).toLocaleString()} đ</span>
                </div>
              ))}
              <div className="d-flex justify-content-between border-top pt-2 mt-2 fw-bold fs-4 text-danger">
                <span>Total Paid:</span>
                <span>{totalAmount.toLocaleString()} đ</span>
              </div>
            </div>

            <button onClick={finishOrder} className="btn btn-danger btn-lg px-5 fw-bold rounded-pill shadow-sm">
              BACK TO HOMEPAGE
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid bg-light py-2 mb-4 border-bottom">
         <div className="container">
            <nav className="breadcrumb mb-0 bg-transparent p-0 small">
              <a className="text-primary text-decoration-none" href="/">Homepage</a>
              <span className="mx-2 text-secondary">/</span>
              <span className="text-secondary fw-bold">Payment Checkout</span>
            </nav>
         </div>
      </div>

      <section className="checkout-section pb-5">
        <div className="container">
          <form onSubmit={handleOrder} className="row g-4 align-items-start">
            
            {/* CỘT TRÁI */}
            <div className="col-lg-7 col-12">
              <div className="bg-white rounded shadow-sm p-4 border mb-4">
                
                {/* 1. REVIEW PRODUCTS */}
                <h5 className="fw-bold mb-4 border-bottom pb-2 text-uppercase text-danger">1. Your Order</h5>
                {cartItems.map((item: any, index: number) => (
                  <div key={index} className="d-flex align-items-center mb-3 pb-3 border-bottom-dashed">
                    <Image
                      src={`${UPLOAD_URL}/${item.image}`}
                      alt={item.name}
                      className="rounded me-3 border"
                      style={{ width: 70, height: 70, objectFit: "cover" }}
                      width={70}
                      height={70}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark">{item.name}</div>
                      <div className="small text-muted">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-end fw-bold">
                      {(item.price * item.quantity).toLocaleString()} đ
                    </div>
                  </div>
                ))}

                {/* 2. CUSTOMER INFO */}
                <h5 className="fw-bold mb-3 mt-4 border-bottom pb-2 text-uppercase text-danger">2. Customer Information</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Full Name *</label>
                    <input type="text" name="fullName" className="form-control" placeholder="Enter your name" required value={customerInfo.fullName} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone Number *</label>
                    <input type="text" name="phone" className="form-control" placeholder="090..." required value={customerInfo.phone} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Email (Optional)</label>
                    <input type="email" name="email" className="form-control" placeholder="example@gmail.com" value={customerInfo.email} onChange={handleChange} />
                  </div>
                </div>

                {/* 3. DELIVERY METHOD (ĐÃ BỔ SUNG LẠI) */}
                <h5 className="fw-bold mb-3 mt-4 border-bottom pb-2 text-uppercase text-danger">3. Delivery Method</h5>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className={`border rounded p-3 cursor-pointer ${customerInfo.deliveryType === 'Home Delivery' ? 'border-danger bg-light' : ''}`}>
                      <div className="form-check mb-0">
                        <input className="form-check-input" type="radio" name="deliveryType" id="delHome" value="Home Delivery" checked={customerInfo.deliveryType === 'Home Delivery'} onChange={handleChange} />
                        <label className="form-check-label fw-bold cursor-pointer" htmlFor="delHome">
                          <i className="bi bi-house-door me-1"></i> Home Delivery
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={`border rounded p-3 cursor-pointer ${customerInfo.deliveryType === 'Pick up at Store' ? 'border-danger bg-light' : ''}`}>
                      <div className="form-check mb-0">
                        <input className="form-check-input" type="radio" name="deliveryType" id="delStore" value="Pick up at Store" checked={customerInfo.deliveryType === 'Pick up at Store'} onChange={handleChange} />
                        <label className="form-check-label fw-bold cursor-pointer" htmlFor="delStore">
                          <i className="bi bi-shop me-1"></i> Pick up at Store
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Delivery Address *</label>
                    <input type="text" name="address" className="form-control" placeholder="Street, Ward, District, City" required value={customerInfo.address} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Note for Driver</label>
                    <textarea name="note" className="form-control" rows={2} placeholder="Note for your order..." value={customerInfo.note} onChange={handleChange}></textarea>
                  </div>
                </div>

                {/* 4. PAYMENT METHOD */}
                <h5 className="fw-bold mb-3 mt-4 border-bottom pb-2 text-uppercase text-danger">4. Payment Method</h5>
                <div className="payment-options border rounded p-3 bg-light">
                  <div className="form-check mb-2">
                    <input className="form-check-input" type="radio" name="paymentMethod" id="cod" value="COD" checked={customerInfo.paymentMethod === 'COD'} onChange={handleChange} />
                    <label className="form-check-label d-flex align-items-center fw-bold" htmlFor="cod">
                      <Image src="/assets/client/img/paymen_home.jpg" alt="cod" className="me-2" width={24} height={24} /> 
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: TỔNG KẾT */}
            <div className="col-lg-5 col-12">
              <div className="bg-white rounded shadow-sm p-4 border sticky-top" style={{ top: '20px', position: 'relative', zIndex: 1 }}>
                <h5 className="fw-bold mb-4 text-uppercase">Order Summary</h5>
                <div className="d-flex justify-content-between py-2 mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">{totalAmount.toLocaleString()} đ</span>
                </div>
                <div className="d-flex justify-content-between py-2 mb-2">
                  <span className="text-muted">Delivery Fee</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between py-3">
                  <span className="fs-5 fw-bold">Total Amount</span>
                  <span className="fw-bold text-danger fs-3">{totalAmount.toLocaleString()} đ</span>
                </div>
                
                <button type="submit" className="btn btn-danger btn-lg w-100 mt-2 fw-bold py-3 shadow border-0 text-uppercase">
                  PLACE ORDER NOW
                </button>
                
                <div className="mt-4 p-3 bg-light rounded text-center">
                   <p className="small text-muted mb-0">
                      <i className="bi bi-shield-check text-success me-1"></i>
                      Your order is secure and protected.
                   </p>
                </div>
              </div>
            </div>

          </form>
        </div>
      </section>

      <style jsx>{`
        .border-bottom-dashed {
          border-bottom: 1px dashed #dee2e6;
        }
        .border-bottom-dashed:last-child {
          border-bottom: none;
        }
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Payment;