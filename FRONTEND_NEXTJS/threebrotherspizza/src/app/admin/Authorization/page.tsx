'use client';

import React, { useState, useEffect } from 'react';
import axiosAdmin from '@/axios/axiosAdmin';

//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang create products
import { useToast } from '@/contexts/ToastContext';

// --- đinh TYPES (cho form phân quyền) ---
import {PermissionTypes, ModuleGroup, Role} from '@/types/AuthorizationTypes'


/***********function form Authorization************/
export default function RolePermissionManager() {

  /*state isClient này Dùng để kiểm tra xem component đã render xong ở phía 
  trình duyệt chưa (tránh lỗi hydration trong Next.js).*/
  const [isClient, setIsClient] = useState(false);
  //state ghi nhận các trạng thái role trong csdl khi render giao diện
  const [roles, setRoles] = useState<Role[]>([]);
  /*state này ghi nhận các module_name và các quyền cụ thể trong module_name 
  đó từ bảng permission khi render giao diện*/
  const [dbModules, setDbModules] = useState<ModuleGroup[]>([]);
  //state này ghi nhận RoleId khi select chọn trên giao diện
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  //state này ghi nhận các permissionid đã tick ở ô checkbox trên giao diện
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  //state này ghi nhận trạng thái loading
  const [loading, setLoading] = useState<boolean>(false);
  
  //khai báo state tu useToast trong ToastContext truyền vào bien state
  const {showToast} = useToast()



  /*****Hàm Lấy dữ liệu ban đầ*****: 
   * -> Nhiệm vụ của nó là lấy toàn bộ dữ liệu cần thiết từ Server về để hiển thị 
   * lên giao diện ngay khi người dùng vừa vào trang.
   * <-> nghĩa là khi hiển thị lên giao diện phân quyền thì nó cần lấy trong csdl
   * coi role đó đã có quyền nào thì thể hiện lên cho người user biêt(vd: là role 
   * admin có full tất cả quyền trong csdl thì hiện các ô checkbox permission hiện
   * tick ô đó lên để hiểu là nó có tồn tại các quyền đó khi tạo csdl rồi, vd là 
   * cashier thì nó chỉ có vài quyền thì hiện lên quyền nào chưa thì để 
   * trống.. để user biết mà tick thêm quyền hay bỏ bớt đi..)**/
  const fetchInitialData = async () => {
    try {
      /*
       + const [resRoles, resModules]: esRoles, resModules]: Kỹ thuật Destructuring
        (phân rã mảng) để hứng kết quả trả về từ 2 API tương ứng vào 2 biến riêng biệt.
       + Promise.all([...]): Thay vì gọi xong API này mới gọi API kia (mất gấp 
       đôi thời gian), dòng này cho phép trình duyệt gửi cả 2 yêu cầu cùng một lúc.
       */
      const [resRoles, resModules] = await Promise.all([
        axiosAdmin.get('/roles/listRoles'), //call api getall lấy tất cả role
        //call api lấy tất cả permission đã gom nhóm theo modul_name
        axiosAdmin.get('/permissions/grouped') 
      ]);

      /*
       + Array.isArray(resRoles.data):  Dòng này kiểm tra xem dữ liệu Server trả 
       về nằm ở đâu để tránh lỗi:
       + Nếu resRoles.data là một mảng: Lấy luôn(lấy resRoles.data luôn)
       + Nếu không: Tìm trong resRoles.data.data (phổ biến khi API bọc kết
        quả trong một object).
        + Nếu cả hai đều không có: Gán bằng một mảng rỗng [] để các hàm .map()
         ở dưới không bị lỗi "undefined". */
      const rolesData = Array.isArray(resRoles.data) ? resRoles.data : (resRoles.data?.data || []);
      //Tương tự như trên, dòng này đảm bảo modulesData luôn là một mảng chứa danh sách các nhóm quyền chức năng.
      const modulesData = Array.isArray(resModules.data) ? resModules.data : (resModules.data?.data || []);

      setRoles(rolesData);
      setDbModules(modulesData);

      /*Điều kiện này tránh việc trang web mới load lên mà ô "Chọn vai trò" bị trống.
      -> Nó kiểm tra nếu có danh sách Role, nó sẽ lấy ID của Role đầu tiên (rolesData[0]) 
      để gán làm Role mặc định đang được chọn.*/
      if (rolesData.length > 0){
         setSelectedRoleId(rolesData[0].id.toString());
      }
    } catch (err) { 
      console.error("Lỗi tải dữ liệu:", err)
     }
  };



  /* useEffect này có ý nghĩa:
   + setIsClient(true): Đánh dấu rằng ứng dụng đã chạy ở phía trình duyệt 
   (Client side). Trong Next.js, code thường được chạy thử ở phía Server trước, 
   việc đặt setIsClient(true) giúp bạn tránh được các lỗi không khớp giao diện 
   (Hydration Error) giữa Server và Client.
   + fetchInitialData(): Gọi hàm lấy dữ liệu từ API (mà bạn đã định nghĩa ở trên) 
   để đổ dữ liệu vào các danh sách Vai trò và Quyền hạn trên giao diện form.
   + Cấu trúc có mảng rỗng [] ở cuối (gọi là dependency array) có nghĩa là: Đoạn 
   code bên trong chỉ chạy duy nhất 1 lần ngay sau khi Component được hiển thị 
   lần đầu tiên trên màn hình(vì nó không có truyền dk nào để ktra cả)
  */
  useEffect(() => {
    setIsClient(true);
    fetchInitialData();
  }, []);


  /* useEffect này có ý nghĩa là Tự động tải dữ liệu khi đổi Vai trò và Xử lý 
  chọn/bỏ chọn từng quyền.(nghĩa là khi có thay đổi quyền mới nó cập nhật 
  và load lại hiển thị trang ngay cho người dùng biết liền)
   + Điều kiện chạy ([selectedRoleId, isClient]): Bất cứ khi nào bạn chọn 
   một Vai trò khác trong ô <select>, hoặc khi trang web vừa tải xong 
   (isClient chuyển sang true), đoạn code bên trong sẽ lập tức thực thi.
   + lưu ý bỏ trong đk if là vì muốn Đảm bảo rằng chỉ khi đã ở trình duyệt
    và đã có ID của vai trò thì mới gọi API (tránh gọi API với ID rỗng gây 
    lỗi 404). */
  useEffect(() => {
    if (isClient && selectedRoleId) {
      /*gọi api lấy role và trả về các permission hiện hữu của role đó
       + then(...): Nếu thành công, nó lấy mảng ID các quyền nhận được 
       từ Server và nạp vào state setSelectedPermissionIds. Lúc này, các 
       checkbox trên màn hình sẽ tự động được tích (checked) dựa vào mảng này.
       + .catch(...): Nếu có lỗi (ví dụ Vai trò này chưa có quyền nào), nó sẽ 
       reset mảng quyền về rỗng [] để xóa sạch các dấu tích cũ trên giao diện.
       + Điều kiện chạy ([selectedRoleId, isClient]): Bất cứ khi nào bạn chọn 
       một Vai trò khác trong ô <select>, hoặc khi trang web vừa tải xong 
       (isClient chuyển sang true), đoạn code bên trong sẽ lập tức thực thi.
      */
      axiosAdmin.get(`/rolehaspermissions/${selectedRoleId}`)
        .then(res => setSelectedPermissionIds(res.data || []))
        .catch(() => setSelectedPermissionIds([]));
    }
  }, [selectedRoleId, isClient]);



  /*hàm xử lý logic dùng để quản lý việc chọn/bỏ chọn (Toggle) các mục 
  trong một danh sách (ở đây là danh sách ID các quyền hạn). 
   + pId: number truyền id này là iViết tắt của "Permission ID". Đây là
    mã số định danh duy nhất của quyền mà người dùng vừa click vào checkbox.
   + setSelectedPermissionIds: Hàm dùng để cập nhật lại danh sách các quyền đã chọn.
   + prev: Đại diện cho trạng thái (state) của mảng selectedPermissionIds ngay tại 
   thời điểm trước khi click. Việc sử dụng prev giúp đảm bảo dữ liệu luôn chính xác 
   tuyệt đối, kể cả khi người dùng click chuột liên tục và nhanh.
   +  prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
   nó kiểm tra bạn đang tick chọn hay bỏ tick chọn ô tên permission dựa trên
   permissionId á
     ++ Nếu prev.includes(pId) là TRUE (Nghìa là quyền đó có thiết lặp cho role
     rồi trong csdl mà mình tick bỏ uncheck ) thì Hàm filter sẽ tạo ra một mảng 
     mới bằng cách lọc qua toàn bộ mảng cũ. Nó chỉ giữ lại những ID nào khác với
     cái pId vừa chọn > Kết quả: ID này bị loại bỏ khỏi mảng. (Tương ứng hành động
      Bỏ chọn - Uncheck).
        +++ vd Bạn Click vào ô ID = 2:
            Số 2 ĐÃ CÓ trong mảng [1, 2, 3, 4].
            Chạy logic lọc bỏ tick: Chỉ giữ lại những gì khác 2.
            Danh sách mới: [1, 3, 4].

      ++ Nếu prev.includes(pId) là FALSE (Nghĩa là khi tick check vào ô permission
      nhưng mà permitionId của ô checkđó Chưa có trong danh sách csdl) thì Hành 
      động: [...prev, pId] > Giải thích: Sử dụng Spread Operator (...) để sao 
      chép toàn bộ các ID cũ sang mảng mới, sau đó thêm pId mới vào cuối mảng.
      Kết quả: ID này được thêm vào mảng. (Tương ứng hành động Chọn thêm - Check). 
        +++ vd Bạn Click vào ô ID = 4:
            Số 4 chưa có trong mảng [1, 2, 3].
            Chạy logic thêm: [...[1, 2, 3], 4] => Danh sách mới: [1, 2, 3, 4].
  */
  const handleTogglePermission = (pId: number) => {
    setSelectedPermissionIds(prev => 
      prev.includes(pId) ? prev.filter(id => id !== pId) : [...prev, pId]
    );
  };



  /*nhiệm vụ gửi toàn bộ các thay đổi mà bạn đã thực hiện trên giao 
  diện về Server để lưu vào Cơ sở dữ liệu.
  + if (!selectedRoleId): Trước khi lưu, hàm kiểm tra xem người dùng
   đã chọn Vai trò (Role) nào chưa. Nếu chưa có ID vai trò, hàm sẽ dừng 
   lại ngay lập tức (return) và hiển thị cảnh báo để tránh gửi dữ liệu
   rác lên Server.  
  + setLoading(true): Dòng này bật trạng thái "đang xử lý". Khi loading 
  là true, nút bấm trên giao diện thường sẽ hiện biểu tượng xoay xoay 
  (spinner) và bị vô hiệu hóa (disabled) để ngăn người dùng bấm liên tục
   nhiều lần trong khi đợi Server phản hồi.
   + const payload = { 
        roleId: parseInt(selectedRoleId), 
        permissionId: selectedPermissionIds 
      }; -> đoạn này có ý nghĩa là 

      ++ payload: Là gói dữ liệu sẽ gửi đi.
      ++ parseInt(selectedRoleId): Chuyển ID vai trò từ dạng chuỗi (string) 
      sang số nguyên (integer) để khớp với kiểu dữ liệu của Database.
      ++ permissionId: Gửi mảng chứa danh sách các ID quyền mà bạn đã tích chọn.
 */
  const handleSave = async () => {
    if (!selectedRoleId) return alert("Vui lòng chọn vai trò");
    setLoading(true);
    try {
      const payload = { 
        roleId: parseInt(selectedRoleId), 
        permissionId: selectedPermissionIds 
      };

      /*gọi api create save lưu các quyền theo cơ chế sync xử lý crud mọt api à
      tức lưu ghi đè khong tách bạc api create, update, delete ra riêng á*/
      await axiosAdmin.post('/rolehaspermissions/syncPermissions', payload);
      showToast("Save Role Permission success!", "success")
    } catch (err) { 
       showToast("Save Role Permission failed!", "danger")
    } finally { 
      /*set trạng thái nút save loading là falase giúp nút bấm quay 
      trở lại trạng thái bình thường để người dùng có thể thao tác tiếp.*/
      setLoading(false); 
    }
  };




  /******TRẢ VỀ GIAO DIỆN ***********/
  return (
    /* ${!isClient ? 'd-none' : '': }
     -> Khi mã chạy lần đầu trên Server, isClient là false, class d-none (ẩn) 
     sẽ được thêm vào.
     -> Chỉ khi mã đã tải xuống trình duyệt (Client) và useEffect đầu tiên chạy, 
     nó mới hiện giao diện. Điều này giúp giao diện không bị "nháy" hoặc lỗi khi 
     dữ liệu Client và Server khác nhau.
    */
    <div className={`container-fluid py-3 bg-light min-vh-100 ${!isClient ? 'd-none' : ''}`}>
      <div className="bg-primary text-white p-3 rounded-top shadow-sm mb-3">
        <h5 className="mb-0 fw-bold uppercase">FUNCTIONAL MANAGEMENT - ASSIGNMENT OF AUTHORITY TO ROLES</h5>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary btn-sm fw-bold px-4 shadow-sm" onClick={handleSave} disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          SAVE ROLE PERMISSIONS
        </button>
      </div>

      <form className="bg-white rounded shadow-sm border overflow-hidden" onSubmit={(e) => e.preventDefault()}>
        <div className="p-3 border-bottom">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text fw-bold">SELECT ROLE</span>
            <select className="form-select fw-bold" value={selectedRoleId} 
                    onChange={(e) => setSelectedRoleId(e.target.value)}>
              {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0 custom-table">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: '60px' }}>Number</th>
                <th style={{ width: '250px' }}>Functional Group</th>
                <th>Role-based Permissions</th>
              </tr>
            </thead>
            <tbody>
              {/* SỬ DỤNG NGOẶC TRÒN ĐỂ TỰ ĐỘNG TRẢ VỀ (IMPLICIT RETURN) */}
              {dbModules.map((module, index) => (
                /* Sử dụng index hoặc kết hợp id với index:
                 -> tránh lỗi trùng module.id
                 -> tránh lõi underfined/null với module.id*/
                <tr key={`module-${module.id}-${index}`}>
                  <td className="text-center fw-bold text-muted">{index + 1}</td>
                  <td className="ps-3 fw-bold text-secondary">{module.name}</td>
                  <td>
                    <div className="p-2">
                      <div className="form-check mb-2">
                        <input 
                          className="form-check-input border-primary" 
                          type="checkbox" 

                          /*Logic Trạng thái của Checkbox "Tất cả" (checked) 
                            -> module.permissions.length > 0: Đảm bảo nhóm này có quyền con thì mới xét tiếp.
                            -> .every(...): Đây là hàm kiểm tra "Tất cả".
                            -> Ý nghĩa: Nó duyệt qua toàn bộ các quyền con của Module đó. Nếu tất cả id 
                            của quyền con đều nằm trong mảng selectedPermissionIds (mảng các quyền đã 
                            chọn), thì ô "Tất cả" sẽ tự động được tích vào.
                            <-> Ngược lại, chỉ cần 1 quyền con bị bỏ tích, ô "Tất cả" sẽ trống.
                          */
                          checked={
                            module.permissions.length > 0 && 
                            module.permissions.every(p => selectedPermissionIds.includes(p.id))
                          }

                          /*Logic Xử lý sự kiện "Chọn tất cả" (onChange) */
                          onChange={(e) => {
                            // Lấy danh sách ID của toàn bộ quyền trong nhóm này
                            const ids = module.permissions.map(p => p.id);
                            /* Nếu TÍCH VÀO:Khi Tích vào (if):
                            -> Nó lấy mảng quyền hiện tại (...prev) gộp với danh sách ID của nhóm này (...ids).
                            -> new Set(...): Đây là một mẹo cực hay để loại bỏ trùng lặp. Nếu một ID đã có rồi,
                             nó sẽ không bị thêm lần nữa.*/
                            if (e.target.checked){
                                setSelectedPermissionIds(prev => [...new Set([...prev, ...ids])]);
                            } else {
                              /* Nếu BỎ TÍCH: khi bỏ tích else
                                -> Nó dùng .filter().
                                -> Nó sẽ giữ lại những ID nào không nằm trong danh sách ID của nhóm này 
                                (!ids.includes(id)).
                                => Kết quả là toàn bộ quyền thuộc nhóm đó sẽ biến mất khỏi mảng 
                                selectedPermissionIds.*/
                              setSelectedPermissionIds(prev => prev.filter(id => !ids.includes(id)));
                            }
                          }}
                        />
                        <label className="form-check-label fw-bold text-primary">Tất cả</label>
                      </div>
                      <div className="d-flex flex-wrap gap-x-4 gap-y-2">

                        {/*Logic Render danh sách quyền con là các permission trong module_name 
                         -> checked={...includes(p.id)}: Tự động kiểm tra xem ID của quyền này 
                         có nằm trong "danh sách đã chọn" hay không để hiển thị dấu tích.
                         -> onChange: Khi click vào từng ô lẻ, nó gọi hàm handleTogglePermission 
                         để thêm hoặc bớt ID đó.
                        */}
                        {module.permissions.map((p) => (
                          <div className="form-check me-3" key={p.id}>
                            <input className="form-check-input" type="checkbox" 
                                   checked={selectedPermissionIds.includes(p.id)} 
                                   onChange={() => handleTogglePermission(p.id)} />
                            <label className="form-check-label small">{p.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form>

      <style jsx>{`
        .bg-primary { background-color: #5d5fef !important; }
        .uppercase { text-transform: uppercase; }
        .custom-table thead th { background-color: #f4f6f9; color: #444; font-size: 0.85rem; padding: 12px; }
        .form-check-input:checked { background-color: #5d5fef; border-color: #5d5fef; }
        .gap-x-4 { column-gap: 1.5rem; }
        .gap-y-2 { row-gap: 0.5rem; }
      `}</style>
    </div>
  );
}