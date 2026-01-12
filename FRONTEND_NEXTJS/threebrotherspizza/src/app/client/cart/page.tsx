/**** nội dung page này thiết kết page cart giỏ hàng** */

"use client";
import Image from "next/image";

//sử dụng icon của lib fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

//import useCart ở cartContext vào dùng: lấy các hàm đã viết trong cartContext để dùng
import {useCart} from '@/contexts/cartContext'

// Thêm import này vào đầu file CartPage
import { useRouter } from "next/navigation";


//make variale api url file upload img
import { UPLOAD_URL } from "@/constants/urls";

const CartPage = () => {
  //khởi tạo các method của cartContext vào page này
  const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart()

  const router = useRouter(); // Khởi tạo router

  /*method xử lý tạm -> cần nghiên cứu lại ????*/
  const handleGoToPayment = () => {
    if (cartItems.length === 0) {
      alert("Your shopping cart is empty!");
      return;
    }
    // Chuyển sang trang payment
    router.push("/client/payment"); 
  };



  return (
    <>
    {/* phần tiêu đề page */}
      <div className="d-flex flex-column section1-hero-flex mb-3">
        <div className="d-flex align-items-center justify-content-between w-100 mb-1">
          <nav className="breadcrumb mb-0 bg-transparent p-0 small">
            <a className="text-primary" href="#">
              THREEBROTHER PIZZA&nbsp;
            </a>
            <span className="breadcrumb-item active text-secondary">
              / Pizza
            </span>
            <span className="breadcrumb-item active"> cart</span>
          </nav>
        </div>
      </div>
    {/*end phần tiêu đề page */}

      <section className="cart-section">
        <div className="container">
          <div className="cart-box bg-white rounded shadow-sm p-4">
            {/* cartItem => chỗ này dùng map vòng lặp để lặp hết các sản phẩm */}
            {cartItems && cartItems.length > 0 && cartItems.map((item, index) => {
              return(
                  <div key={index} className="cart-item-box mb-3 p-3 rounded-3 position-relative"
                    style={{backgroundColor: "rgb(219 227 216 / 66%)"}}
                  >
                    <div className="d-flex align-items-center mb-2">
                      {/* ảnh sản phẩm */}
                      <Image
                        src={`${UPLOAD_URL}/${item.image}`}
                        alt="Laptop"
                        className="cart-item-Image rounded me-3"
                        style={{ objectFit: "cover" }}
                        width={60}
                        height={60}
                      />
                      {/* tên */}
                      <div className="flex-grow-1">
                        <div className="fw-bold cart-item-title">
                          {item.name}
                        </div>
                      </div>
                      {/* đơn giá: nếu só lượng dưới 1 hiển thị giá bt từ product 
                      còn nếu trên 1 có nghĩa là có tăng thì tính lấy sl*đơn giá = tiền */}
                      <div className="text-end ms-2">
                        <div className="cart-item-price text-danger fw-bold">
                          {item.quantity > 1 ?
                           (
                              (Number(item.price) * (item.quantity)).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD"
                              })
                           ) :
                           (
                              Number(item.price).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD"
                              })
                           )

                          }
                        </div>
                      </div>
                      <button className="btn btn-link text-danger ms-2 cart-item-remove">
                        <i className="fa fa-trash"></i>
                      </button>

                      {/* NÚT XÓA: Cập nhật sự kiện onClick  khi nhấn nút xóa*/}
                      <button className="btn btn-link text-danger ms-2 cart-item-remove"
                      onClick={()=> removeFromCart(item.id)}>
                        <FontAwesomeIcon icon={faTrash} className="fa-fw" />
                      </button>
                    </div>

                    {/* số lượng sản phẩm */}
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fw-bold">Quantity:</span>
                      <div
                        className="input-group input-group-sm cart-qty-group"
                        style={{ width: "110px" }}
                      >
                        <button
                          className="btn btn-outline-secondary cart-qty-minus"
                          type="button"
                          // ngay khi nhấn dấu - nó sẽ giảm sản phẩm
                          onClick={() => updateQuantity(item.id, item.quantity-1)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="htmlForm-control text-center cart-qty-input"
                          value={item.quantity}
                          style={{ maxWidth: "40px" }}
                        />
                        <button
                          className="btn btn-outline-secondary cart-qty-plus"
                          type="button"
                          // ngay khi nhấn dấu + nó sẽ tăng sản phẩm
                          onClick={() => updateQuantity(item.id, item.quantity+1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
              )
            }) }
            {/*end cartItem */}


           {/* button Order Payment */}
            <div className="cart-summary-box bg-light rounded-3 p-4 mb-2 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold fs-5">Total Amount:</span>
                <span className="text-danger fw-bold fs-4">
                  {totalAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </span>
              </div>
              <div className="text-end">
                <button className="btn btn-danger btn-lg px-5 cart-confirm-btn fw-bold shadow"
                  // gọi sự kiện xử lý chuyển từ cart đổ vào payment
                  onClick={handleGoToPayment}
                >
                  Order Payment <i className="bi bi-credit-card-2-front ms-2"></i>
                </button>
              </div>
            </div>
            {/*end button Order Payment */}

          </div>
        </div>
      </section>
    </>
  );
};
export default CartPage;
