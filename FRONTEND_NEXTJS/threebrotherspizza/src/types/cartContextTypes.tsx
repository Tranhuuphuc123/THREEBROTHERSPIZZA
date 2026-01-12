import { ReactNode } from "react";

/** Định nghĩa kiểu dữ liệu cho một sản phẩm trong giỏ hàng **/
export interface CartItemTypes {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

/** Định nghĩa kiểu dữ liệu cho giá trị mà Context sẽ cung cấp **/
export interface CartContextTypes {
  cartItems: CartItemTypes[]; // Đã sửa tên từ cardItems thành cartItems cho chuẩn
  addToCart: (product: any) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: () => number;
}

/** Provider Component **/
export interface CartProviderProps {
  children: ReactNode;
}
