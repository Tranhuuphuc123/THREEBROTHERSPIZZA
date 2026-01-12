/* file này tạo mẫu chung context cho cart giỏ hàng chuẩn context của react 
(rành context sau này có thể thay thế phần context viết theo chuẩn redux)*/
'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { Prev } from "react-bootstrap/esm/PageItem";
import {CartItemTypes, CartContextTypes, CartProviderProps} from '@/types/cartContextTypes'

/* THIET KE FORM CONTEXT TRONG NEXTJS
 I/ khai niem 
  -> context (react context api) là một cơ chế chính thức cảu react 
  -> nó cho phép mày chia sẽ dử liệu cho toàn cục(ai dùng cũng đc)
  -> nó giúp liên kết các components với nhau mà không cần truyền props nhiều cấp 

 II/ trc khi có context thì ta giải quyết vấn đề ntn
  ->  mún truyền dữ liệu từ compoent a -> b thì nó phải truyền props thông qua c <d styleName={}></d>
  -> kỹ thuật truyền như vậy gọi props drilling (truyền props nhiều cấp)
  -> hạn chế: rườm rà, khó quản lý, viết code dài dòng

  III/ chuẩn đẻ mà mày tạo contexxt là gí
   1/ createContext: tạo context 
   2/ provider: lớp bao bọc compoents con để chia sẽ dử liệu
   3/ useContext: hook đẻ các components con truy cập dữ liều từ provider

   ==> ở đây cart context đc thiết kế như một cái kho lưu trữ, một giỏ sách lưu 
   hàng tạm của khách hàng trc khi đc mua
*/



/*#####qui trình 1. Khởi tạo context#####*/
const cartContext = createContext<CartContextTypes | undefined>(undefined);



/* ####qui trình 2##### xây dựng Profider: là một method trung gian giúp làm nhiệm 
vụ tương tác trực tiếp với kho cart theo chuẩn context thiết kế ở đây nó 
sẽ định nghĩa các phương thức cần có cho một giỏ hàng: add(thêm sản phẩm),
remmove(loại bỏ sản phẩm không cần), update(cập nhật đơn hàng vd tăng số 
lương so với ban đầu), clear(xóa đơn hàng sau khi thanh toán xong clear 
giỏ hàng trống)
 --> provider sẽ cung cáp các phương thức đó cho component gọi khi người 
 dùng gửi request lên
 ==> lưu ý: compoent từ request người dùng yêu câu không nên gọi trực tiếp 
 context cart mà nên thông qua provider
*/
export const CartProvider = ({children}: CartProviderProps) => {
  //khởi tạo state giỏ hàng
  const [cartItems, setCartItems] = useState<CartItemTypes[]>([])

  //load giỏ hàng từ key lưu ở localstorage khi component đc gọi
  useEffect(() => {
    //lấy các thông tin của cart từ localStorage
    const saveCart = localStorage.getItem('cart')
    if(saveCart){
        try {
            //chuyên đổi tt đó thành json đừa vào giao diện hiện thị thiết lặp vào state cartItem
            setCartItems(JSON.parse(saveCart))
        }catch(error){
            console.error("error parse cart:", error);
        }
    }
  }, [])

    /* UseEffect này giúp update lại thông tin các sản phẩm khi có sự thay đổi 
    từ localstorage
    -> nó update lại các state liền kèo để khi localstorage đang có sự thay đổi 
    ý là vd người dùng update mua từ 1 thành 2 sản phẩm đi or là đang chọn 10 
    giờ giảm muốn còn 5 thui thì useefect này giúp update lại ngay để hiển thị
    lên giỏ hàng liền cho người dùng thấy liền sản phẩm đã đc cập nhật đc*/
    useEffect(() =>{
        localStorage.setItem('cart', JSON.stringify(cartItems))
    }, [cartItems])


    /**thêm sản phẩm vào giỏ hàng****
     * ###work flow##
     * + đầu tiền tìm coi sản phẩm thêm đã có trong giỏ hàng chưa? 
     * + nếu có method add này giúp nó tắng số lượng lên +1
     * + nếu không dùng method add này thì giữ số lượng cũ add vào giỏ hàng
     * + cuối cùng cập nhật giỏ hàng trong state
    */
    const addToCart = (product:any) => {
         // Kiểm tra xem product truyền vào có tồn tại không để tránh lỗi id
        if (!product || !product.id) return;

        setCartItems((prev) => {
            /*kiểm tra id sản phảm có tồn tại không trùng khớp không: vd mua sp a rồi
            bấm mua thêm thì nó khong thêm dòng mới mà sẽ tắng số lượng của sp mua trc 
            đó lên 2 3 4... còn nếu không trùng thì thôi giữ sp đó thêm vào giỏ hàng thui*/
            const exists = prev.find((item) => item && item.id === product.id)

            //nếu sản phảm đã có trong giỏ hàng rồi
            if(exists){
                return prev.map((item) => 
                    item.id === product.id 
                    ? {...item, quantity:item.quantity + product.quantity} 
                    : item
                )
            }
            //nếu sản phẩm không có trong giỏ hàng thì thêm mới
            return[...prev, {...product, quantity: product.quantity}]
        })
    }


    /***xóa sản phẩm ra khỏi hàng ***/
   const removeFromCart = (productId:number) => {
    /* dùng filter đễ xóa theo quy tắc như vầy nè nó lọc xem coi id nào không trùng 
    với id sản phẩm muốn xóa thì nó giữ lại mặc nhiên cái không giống cái id đc chọn 
    thì bị xóa 
     + vd: có 3 sp productId là 1 2 3 giờ mình muốn xóa là id số 3 thì filter lọc 
     kiểm tra nó thấy id 1 2 không trùng với id muốn xóa là 3 thì nó giữ lại và còn 
     id product 3 thì xóa đi
     => làm vày nhanh hơn là đi tìm id muốn xóa rồi mới thực hiện hóa filter này giúp 
     lộc lần 1 coi nào khác id cần xóa thì giữa mặc nhiên cái kia code tự hiểu là loại 
     nó luôn */
    setCartItems( (prev) => prev.filter(item => item.id !== productId))
   }


   /***update sản phẩm trong giỏ hàng*** 
    * => tiềm sản phẩm nào khớp sản phẩm cần update
    * => tiến hành update lại thui: update số lượng mới quantity 
    * cho đúng productId cần update lại trong giỏ hàng
   */
   const updateQuantity = (productId: number, quantity: number) => {
     //kiểm tra số lượng có hợp lệ khong khống chế hong cho giảm hơn 1
     const validQuantity = quantity > 0 ? quantity : 1
     setCartItems((prev) =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: validQuantity} : item
      )
    );
   }

   /***clear xóa sạch giỏ hàng****/
   const clearCart = () => {
     setCartItems([])
   }

    /** TÍNH TỔNG TIỀN: 
     * Tính toán trực tiếp dựa trên cartItems hiện tại.
     * Mỗi khi cartItems thay đổi, biến này sẽ tự tính lại.
    **/
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (Number(item.price) * item.quantity);
    }, 0);


    /*method tính tổng số lượng mặt hàng đã mua hiển thị lên nút button cart
    ở trên header trang client */
    const totalItems = () => {
      return cartItems.length
    }


   /***kết quả trả về của provider no cung cấp 4 method này cho compoent nào muốn dùng***/
   return(
    <cartContext.Provider value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems
    }}>
        {children}
    </cartContext.Provider>
   )
}



/*###qui tình 3: export useContext###
=> xuất exprot ra để các compoent muốn lấy sử dụng lớp này là ở exprot useContext */
export const useCart = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

