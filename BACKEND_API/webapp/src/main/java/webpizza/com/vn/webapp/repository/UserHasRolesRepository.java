package webpizza.com.vn.webapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import webpizza.com.vn.webapp.entity.UserHasRoles;

/*Repository này vài điểm khác là
 + Dùng trực tiếp class JpaRepository: JpaRepository là một "siêu giao diện". 
 Nó kế thừa từ cả PagingAndSortingRepository và CrudRepository. JpaRepository
 tối ưu và họ trợ mạnh hơn ở các hàm vd findAll... nó trả về list chứ không chỉ
 đơn giản là các iterable rồi phải đi ép kiểu...
 + thểm method deleteByUserId: hiểu thế này trong quy tắc của giao diện phân quyền
 là select User chọn tick vào checkbox của danh sách roles rồi nhấn save , lần 
 sau khi tick chọn lại thì nhấn save nó sẽ xóa cái cũ và create lại cái mới 
 đó là cơ chế hoạt động độc lập của giao diện form phan quyền nghĩa là delete create 
 và update trong mọt lệnh một api mà thui
 + findByUserId trả về mọt list là vì như tôi nói create delete và udpate chỉ trong một 
 api trong một button save mà thui không có tách ra các api riêng nên nếu muốn tick chọn 
 lại thì có findByROleID này giúp xác định trong csdl là các quyền đã đc create trc đó có 
 rồi nó ghi nhận lại và khi select User đó ra thì nó tiềm id của User mà nó thấy trong 
 csdl có roles gì rồi thì mình có thể lôi nó ra hiển thị trên giao diện luôn
 ===> tóm lại có sự thay đổi này là vì tôi đang xây dựng cơ chế gọi là kỹ thuật Sync 
 (Synchronization) Đây là thuật ngữ phổ biến nhất. Sync (Đồng bộ hóa) có nghĩa là bạn 
 làm cho dữ liệu ở Backend (CSDL) khớp hoàn toàn với những gì người dùng vừa chọn trên UI.
    + Logic hoạt động: Server sẽ so sánh danh sách User hiện tại trong DB và danh 
    sách roles thiết lặp cho user bạn gửi lên.
    + Role nào có trong UI nhưng chưa có trong DB -> Insert.
    + Role nào có trong DB nhưng UI không chọn nữa -> Delete.

 ==> tóm lại lần nữa quy tình này nó giúp  Khi bạn gom nhiều hành động (Thêm, Xóa, Sửa) 
 vào một lần gửi dữ liệu, nó gọi là Batch Processing (Xử lý theo lô). Thay vì gọi 10 API 
 để lưu 10 quyền, bạn chỉ gọi 1 API mang theo một mảng dữ liệu.    
*/
@Repository
public interface UserHasRolesRepository extends JpaRepository<UserHasRoles, Integer>{
   // Xóa sạch để nạp mới (Phục vụ hàm Sync)
    public void deleteByUserId(Integer userId);
    
    // Tìm danh sách Roles hiện có của 1 user để hiện các Roles đó vào ô checkbox của giao diện
    List<UserHasRoles> findByUserId(Integer userId);
}
