"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from '@/contexts/cartContext';
import { useRouter } from "next/navigation";
import { UPLOAD_URL } from "@/constants/urls";
import { paymentTypes } from '@/types/PaymentTypes'
import { OrderDetailTypes, OrderPayload } from '@/types/OrderDetailTypes'


//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang create products
import { useToast } from '@/contexts/ToastContext';
import axiosClient from "@/axios/axiosClient";

const Order = () => {
  /*state của cartContext cartItem... để đổ value từ cart ở localstorage vào payment
   => cartItems nay se chua tat cac products tu csdl do vao cart -> payment
  */
  const { cartItems, totalAmount, clearCart } = useCart();
  //state cập nhật api thông tin trạng thái user từ token
  const [currentUser, setCurrentUser] = useState<any>(null)
  //state cập nhật api list danh sach các phương thức thanh toán paymentTypes
  const [listPaymentTypes, setListPaymentTypes] = useState([]);
  //state cap nhat ghi nhan gia tri chon hinh thuc thanh toan tu nguoi dung
  const [paymentType, setPaymentType] = useState<number | null>(null)
  //state quan ly thu thap thong tin ship_method cua order
  const [shipMethod, setShipMethod] = useState("1")
  //state thu nhap thong tin luu tru dia chi giao hang
  const [shipAddress, SetShipAddress] = useState('')
  //state thu nhap ghi chu thong description cho don hang
  const [shipNote, setShipNote] = useState('')


  //khởi tạo userRouter
  const router = useRouter();

  //khai báo state tu useToast trong ToastContext truyền vào bien state
  const { showToast } = useToast()


  /*#### Hàm gọi API lấy user đổ vào userinfor của payemnt page ####*/
  const fetchUserByToken = async () => {
    try {
      const res = await axiosClient.get(`/users/me`);
      if (res.data) {
        setCurrentUser(res.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };


  /*#### Hàm gọi API lấy paymentTypes đổ vào mục hình thức thanh toán của trang này ####*/
  const fetchListPaymentTypes = async () => {
    try {
      const res = await axiosClient.get('/payment_types')
      // Vì Backend trả về Map { data: [...], msg: "..." }
      // Nên dữ liệu thật nằm ở res.data.data
      if (res.data && res.data.data) {
        setListPaymentTypes(res.data.data); // Lấy đúng mảng trong key "data"
      }
    } catch (error) {
      console.error("Error fetching payment types:", error);
      setListPaymentTypes([]); // Tránh lỗi crash trang
    }
  }


  /*### method xu ly call api create new order add cac thong tin json khi nhan nut 
  submit day json do vao order order detail, .... tren csdl###*/
  const createNewOrder = async (payload: OrderPayload) => {
    try {
      const res = await axiosClient.post('/orders/create-new-order', payload);
      if (res.data) {
        showToast('Order created successfully', 'success');
        clearCart();
        router.push('/client');
      }
    } catch (error) {
      console.error("Error creating order:", error);
      showToast('Failed to create order', 'error');
    }
  }


  /*#### method xử lý nút thanh toán  ####*/
  const handleSubmitOrder = (e: React.FormEvent) => {
    // ngan hanh vi mac dinh cuar form submit
    e.preventDefault();

    // Kiểm tra nếu chưa có currentUser (tránh customerId bị null/undefined)
    // if (!currentUser?.id) {
    //   showToast('User information not found. Please log in again.', 'error');
    //   return;
    // }

    // Kiểm tra nếu người dùng chưa chọn phương thức thanh toán
    if (!paymentType) {
      showToast('Please select a payment method.', 'warning');
      return;
    }

    //khoi tao payload chua thong tin nguoi dung nhap de create new order
    createNewOrder({
      cashierId: 3,
      customerId: 3,//currentUser.id,
      paymentTypeId: paymentType,
      shipName: currentUser?.username || "Guest",
      shipAddress,
      orderDate: new Date(),
      shippedDate: null,
      paidDate: null,
      status: 1,
      shipMethod,
      note: shipNote,
      // list order detail: luu thong tin don hang vao order detail
      orderDetails: cartItems.map((item: any) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        promotionId: 1,
        orderDetailStatus: 1,
        subtotal: item.price * item.quantity
      }))
    });
  }



  /* tạo useEffect kiểm tra coi đăng nhâp chưa nếu không thông 
  báo là chưa login và yêu cầu chuyển sang trang login để bắt đăng nhập */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Please log in to proceed with payment.', 'warning');
      router.push('/client/login');
      return; // Dừng không cho gọi API bên dưới
    }

    // Nếu có token mới gọi API lấy thông tin
    fetchUserByToken();
    // Nếu có token thì gọi api lấy paymentypes
    fetchListPaymentTypes();
  }, []) //  [] Chỉ chạy 1 lần khi component mount


  /* return về giao diện trang payment */
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

          {/* form trang payment thanh toán đặt hàng */}
          <form onSubmit={handleSubmitOrder} className="row g-4 align-items-start">
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
                    <input type="text" name="fullName" className="form-control"
                      placeholder="Enter your name"
                      // đổ thông tin user vào các mục use  infor ở page thanh toán 
                      value={currentUser?.username || ''}
                      required
                      readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Phone Number *</label>
                    <input type="text" name="phone" className="form-control"
                      placeholder="090..."
                      // đổ thông tin user vào các mục use  infor ở page thanh toán 
                      value={currentUser?.phone || ''}
                      required
                      readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">Email (Optional)</label>
                    <input type="email" name="email" className="form-control"
                      placeholder="example@gmail.com"
                      // đổ thông tin user vào các mục use  infor ở page thanh toán 
                      value={currentUser?.email || ''}
                      readOnly />
                  </div>
                </div>

                {/* 3. DELIVERY METHOD (ĐÃ BỔ SUNG LẠI) => dang checkbox radio*/}
                <h5 className="fw-bold mb-3 mt-4 border-bottom pb-2 text-uppercase text-danger">3. Delivery Method</h5>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div className='border rounded p-3 cursor-pointer'>
                      <div className="form-check mb-0">
                        <input className="form-check-input"
                          type="radio"
                          name="deliveryType"
                          id="delHome"
                          value="1"
                          // xu ly thu nhap thong tin chon ship method cua nguoi dung
                          onChange={(e) => setShipMethod(e.target.value)}
                          //ngay khi nguoi dung chon o muc nay thi checked tinh la 1
                          checked={shipMethod === "1"}
                        />
                        <label className="form-check-label fw-bold cursor-pointer" htmlFor="delHome">
                          <i className="bi bi-house-door me-1"></i> Home Delivery
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className='border rounded p-3 cursor-pointer'>
                      <div className="form-check mb-0">
                        <input className="form-check-input" type="radio"
                          name="deliveryType" id="delStore"
                          value="2"
                          onChange={(e) => setShipMethod(e.target.value)}
                          checked={shipMethod === "2"}
                        />
                        <label className="form-check-label fw-bold cursor-pointer" htmlFor="delStore">
                          <i className="bi bi-shop me-1"></i> Pick up at Store
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Dia chi giao hang */}
                  <div className="col-12">
                    <label className="form-label small fw-bold">Delivery Address *</label>
                    <input type="text" name="address" className="form-control"
                      placeholder="Street, Ward, District, City"
                      required
                      value={shipAddress}
                      onChange={(e) => SetShipAddress(e.target.value)} />
                  </div>

                  {/* Ghi chu thong tin khi giao hang */}
                  <div className="col-12">
                    <label className="form-label small fw-bold">Note for Driver</label>
                    <textarea name="note" className="form-control" rows={2}
                      placeholder="Note for your order..."
                      value={shipNote}
                      onChange={(e) => setShipNote(e.target.value)}>

                    </textarea>
                  </div>
                </div>

                {/* 4. PAYMENT METHOD */}
                <h5 className="fw-bold mb-3 mt-4 border-bottom pb-2 text-uppercase text-danger">4. Payment Method</h5>
                <div className="payment-options">
                  {/* dùng map duyệt qua từng phần phương thức thanh toán trong csdl */}
                  {listPaymentTypes && listPaymentTypes.map((type: any) => (
                    <div key={type.id} className="border rounded p-3 bg-light mb-2 cursor-pointer shadow-sm">
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="paymentMethod"
                          id={`payment-${type.id}`}
                          value={type.id}
                          onChange={(e) => setPaymentType(parseInt(e.target.value))}
                          required
                        />
                        <label className="form-check-label d-flex align-items-center fw-bold cursor-pointer" htmlFor={`payment-${type.id}`}>
                          {type.image && (
                            <Image
                              src={`${UPLOAD_URL}/${type.image}`}
                              alt={type.name}
                              className="me-3"
                              width={30}
                              height={30}
                            />
                          )}
                          <div>
                            <div className="text-dark">{type.name}</div>
                            {type.description && (
                              <div className="small text-muted fw-normal">{type.description}</div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
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
          {/* end form trang payment thanh toán đặt hàng */}
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

export default Order;