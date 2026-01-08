/**** nội dung page này thiết kết page cart giỏ hàng** */

"use client";
import Image from "next/image";

const CartPage = () => {
  return (
    <>
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

      <section className="cart-section py-4">
        <div className="container">
          <div className="cart-box bg-white rounded shadow-sm p-4">
            <div className="d-flex align-items-center mb-3">
              <input
                type="checkbox"
                className="htmlForm-check-input me-2"
                id="cartSelectAll"
                checked
              />
              <label htmlFor="cartSelectAll" className="fw-bold">
                Chọn tất cả (1)
              </label>
            </div>

            <div className="cart-item-box mb-3 p-3 rounded-3 bg-light position-relative">
              <div className="d-flex align-items-center mb-2">
                <input
                  type="checkbox"
                  className="htmlForm-check-input me-2 cart-item-check"
                  checked
                />
                <Image
                  src="/assets/client/img/pizzaCake/pepperoni.jpg"
                  alt="Laptop"
                  className="cart-item-Image rounded me-3"
                  style={{ objectFit: "cover" }}
                  width={60}
                  height={60}
                />
                <div className="flex-grow-1">
                  <div className="fw-bold cart-item-title">
                    PIzza Pesto
                  </div>
                  <div className="small text-muted">Color: Green</div>
                </div>
                <div className="text-end ms-2">
                  <div className="cart-item-price text-danger fw-bold">
                    25 USD
                  </div>
                  <div className="cart-item-oldprice text-muted small">
                    <del>30 USD</del>
                  </div>
                </div>
                <button className="btn btn-link text-danger ms-2 cart-item-remove">
                  <i className="fa fa-trash"></i>
                </button>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="fw-bold">Number:</span>
                <div
                  className="input-group input-group-sm cart-qty-group"
                  style={{ width: "110px" }}
                >
                  <button
                    className="btn btn-outline-secondary cart-qty-minus"
                    type="button"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    className="htmlForm-control text-center cart-qty-input"
                    value="1"
                    style={{ maxWidth: "40px" }}
                  />
                  <button
                    className="btn btn-outline-secondary cart-qty-plus"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="cart-summary-box bg-light rounded-3 p-3 mb-2">
              <div className="text-end">
                <button className="btn btn-danger btn-lg px-5 cart-confirm-btn">
                  Order payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default CartPage;
