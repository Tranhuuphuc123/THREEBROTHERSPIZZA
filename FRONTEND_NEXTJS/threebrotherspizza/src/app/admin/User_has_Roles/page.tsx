'use client';

import React, { useState, useEffect } from 'react';
import axiosAdmin from '@/axios/axiosAdmin';

//import useToast trong ToastContext(viết riêng chuẩn context ấy) để sử dụng cho trang quản lý
import { useToast } from '@/contexts/ToastContext';

// --- đinh TYPES (cho form phân quyền user) ---
import { UserTypes, Role } from '@/types/AuthorizationTypes';

/***********function form User Roles Manager************/
export default function UserRolesManager() {

  /*state isClient này Dùng để kiểm tra xem component đã render xong ở phía 
  trình duyệt chưa (tránh lỗi hydration trong Next.js).*/
  const [isClient, setIsClient] = useState(false);
  //state ghi nhận danh sách user trong csdl khi render giao diện
  const [users, setUsers] = useState<UserTypes[]>([]);
  //state này ghi nhận tất cả các role có trong hệ thống để liệt kê ra checkbox
  const [roles, setRoles] = useState<Role[]>([]);
  //state này ghi nhận userId khi select chọn trên giao diện
  const [selectUserId, setSelectUserId] = useState<string>("");
  //state này ghi nhận các roleId đã tick ở ô checkbox trên giao diện
  const [selectRoleIds, setSelectRoleIds] = useState<number[]>([]);
  //state này ghi nhận trạng thái loading
  const [loading, setLoading] = useState<boolean>(false);
  
  //khai báo state tu useToast trong ToastContext truyền vào bien state
  const { showToast } = useToast();

  /*****Hàm Lấy dữ liệu ban đầu*****: 
   * -> Nhiệm vụ của nó là lấy toàn bộ dữ liệu cần thiết từ Server về để hiển thị 
   * lên giao diện ngay khi người dùng vừa vào trang.
   * <-> Ở đây nó lấy danh sách người dùng (Users) và danh sách tất cả các vai trò (Roles)
   * hiện có trong hệ thống để chuẩn bị cho việc gán quyền.**/
  const fetchInitialData = async () => {
    try {
      /*
       + const [resUsers, resRoles]: Kỹ thuật Destructuring để hứng kết quả trả về.
       + Promise.all([...]): Gửi cả 2 yêu cầu lấy Users và Roles cùng lúc để tiết kiệm thời gian.
       */
      const [resUsers, resRoles] = await Promise.all([
        axiosAdmin.get('/users/listUsers'), // call api lấy danh sách user
        axiosAdmin.get('/roles/listRoles')  // call api lấy danh sách tất cả role
      ]);
      const usersData = Array.isArray(resUsers.data) ? resUsers.data : (resUsers.data?.data || []);
      const rolesData = Array.isArray(resRoles.data) ? resRoles.data : (resRoles.data?.data || []);

      setUsers(usersData);
      setRoles(rolesData);

      /* Tránh việc trang web mới load lên mà ô "Chọn User" bị trống.
         Lấy ID của User đầu tiên làm mặc định. */
      if (usersData.length > 0) {
        setSelectUserId(usersData[0].id.toString());
      }
    } catch (err) { 
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  /* useEffect này có ý nghĩa:
   + setIsClient(true): Tránh lỗi Hydration trong Next.js.
   + fetchInitialData(): Lấy dữ liệu danh sách User và Role đổ vào form.
   + []: Chỉ chạy duy nhất 1 lần khi load trang.
  */
  useEffect(() => {
    setIsClient(true);
    fetchInitialData();
  }, []);

  /* useEffect này có ý nghĩa là Tự động tải danh sách Role của User khi đổi User:
   + Bất cứ khi nào bạn chọn một User khác trong ô <select>, đoạn code sẽ thực thi.
   + Nó gọi API để xem User đó đang nắm giữ những vai trò (roles) nào.
  */
  useEffect(() => {
    if (isClient && selectUserId) {
      /* gọi api lấy danh sách roleId mà user này đang có
         + res.data || []: Nạp mảng ID vai trò vào state selectRoleIds để tự động tick checkbox.
      */
      axiosAdmin.get(`/userhasroles/${selectUserId}`)
        .then(res => setSelectRoleIds(res.data || []))
        .catch(() => setSelectRoleIds([]));
    }
  }, [selectUserId, isClient]);

  /* hàm xử lý logic dùng để quản lý việc chọn/bỏ chọn (Toggle) vai trò:
   + rId: Role ID của vai trò vừa click.
   + prev.includes(rId) ? ... : ... : Nếu đã có thì lọc bỏ (Uncheck), nếu chưa có thì thêm vào (Check).
  */
  const handleToggleRole = (rId: number) => {
    setSelectRoleIds(prev => 
      prev.includes(rId) ? prev.filter(id => id !== rId) : [...prev, rId]
    );
  };

  /* hàm handleSave gửi dữ liệu về Server:
   + payload: Gồm userId và mảng các roleIds đã chọn.
   + syncRoles: API xử lý lưu đè toàn bộ vai trò cho user một cách nhanh chóng.
 */
  const handleSave = async () => {
    if (!selectUserId) return alert("Please select join User");
    setLoading(true);
    try {
      const payload = { 
        userId: parseInt(selectUserId), 
        roleIds: selectRoleIds 
      };

      await axiosAdmin.post('/userhasroles/syncUserHasRoles', payload);
      showToast("Save User Roles success!", "success");
    } catch (err) { 
       showToast("Save User Roles failed!", "danger");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className={`container-fluid py-3 bg-light min-vh-100 ${!isClient ? 'd-none' : ''}`}>
      <div className="bg-primary text-white p-3 rounded-top shadow-sm mb-3">
        <h5 className="mb-0 fw-bold uppercase">FUNCTION MANAGEMENT - ASSIGNING ROLES TO USERS</h5>
      </div>

      <div className="mb-3">
        <button className="btn btn-primary btn-sm fw-bold px-4 shadow-sm" onClick={handleSave} disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          SAVE USER ROLES
        </button>
        <button className="btn btn-success btn-sm fw-bold px-4 shadow-sm ms-2"  disabled={loading}>
          {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
          ADD NEW ROLES
        </button>
      </div>

      <form className="bg-white rounded shadow-sm border overflow-hidden" onSubmit={(e) => e.preventDefault()}>
        <div className="p-3 border-bottom">
          <div className="input-group" style={{ maxWidth: '400px' }}>
            <span className="input-group-text fw-bold text-secondary">CHỌN USER</span>
            <select className="form-select fw-bold text-primary" value={selectUserId} 
                    onChange={(e) => setSelectUserId(e.target.value)}>
              {users.map(user => <option key={user.id} value={user.id}>{user.username}</option>)}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0 custom-table">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: '60px' }}>STT</th>
                <th style={{ width: '100px' }}>Chọn</th>
                <th style={{ width: '250px' }}>Mã vai trò</th>
                <th>Tên vai trò hiển thị</th>
              </tr>
            </thead>
            <tbody>
              {/* Vì bảng Role không phân nhóm Group, ta map trực tiếp danh sách roles */}
              {roles.map((role, index) => (
                <tr key={role.id}>
                  <td className="text-center fw-bold text-muted">{index + 1}</td>
                  <td className="text-center">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      /* Logic Trạng thái: Kiểm tra ID vai trò có trong mảng đã chọn không */
                      checked={selectRoleIds.includes(role.id)}
                      onChange={() => handleToggleRole(role.id)}
                    />
                  </td>
                  <td className="ps-3 fw-bold text-secondary">{role.name}</td>
                  <td className="ps-3 text-dark">{role.display_name}</td>
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
      `}</style>
    </div>
  );
}