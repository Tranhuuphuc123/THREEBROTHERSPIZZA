/* file này tạo mẫu chung context cho cart giỏ hàng chuẩn context của react 
(rành context sau này có thể thay thế phần context viết theo chuẩn redux)*/

import { createContext } from "react";

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
*/


/*qui trình 1. Khởi tạo context*/
//const cartContext = createContext();
