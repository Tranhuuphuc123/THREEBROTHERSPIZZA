'use client';

import React, { useState, useEffect } from 'react';

export default function RolePermissionManager() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const modules = [
    { id: 1, name: "Tiếp nhận hồ sơ", permissions: ["Xem - Chức năng Tiếp nhận hồ sơ", "Thêm mới - Chức năng Tiếp nhận hồ sơ"] },
    { id: 2, name: "Trang Dashboard", permissions: ["Xem - Chức năng Trang Dashboard"] },
    { id: 3, name: "Xử lý hồ sơ", permissions: ["Xem - Chức năng Danh sách hồ sơ", "Thêm mới - Chức năng Danh sách hồ sơ", "Cập nhật - Chức năng Danh sách hồ sơ", "Cập nhật ngày xử lý - Danh sách hồ sơ", "Xóa - Chức năng Danh sách hồ sơ"] },
    { id: 4, name: "Theo dõi hồ sơ", permissions: ["Xem - Chức năng Quản trị rủi ro", "Thêm mới - Chức năng Quản trị rủi ro", "Cập nhật - Chức năng Quản trị rủi ro", "Xóa - Chức năng Quản trị rủi ro"] },
  ];

  return (
    <div className="container-fluid py-3 bg-light min-vh-100">
      
      {/* 1. TIÊU ĐỀ CHÍNH MÀU XANH TÍM */}
      <div className="bg-primary text-white p-3 rounded-top shadow-sm mb-3">
        <h5 className="mb-0 fw-bold uppercase text-align">QUẢN LÝ CHỨC NĂNG - PHÂN QUYỀN CHO VAI TRÒ</h5>
      </div>

      {/* 2. HÀNG NÚT ĐIỀU KHIỂN (TÁCH BIỆT) */}
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-outline-warning btn-sm fw-bold px-3 shadow-sm">
          « Trở về
        </button>
        <button className="btn btn-outline-primary btn-sm fw-bold px-3 shadow-sm bg-white">
          Thêm chức năng
        </button>
        <button className="btn btn-secondary btn-sm fw-bold px-3 shadow-sm" disabled>
          Lưu các quyền của vai trò
        </button>
        <button className="btn btn-secondary btn-sm fw-bold px-3 shadow-sm" disabled>
          Lưu thay đổi của vai trò
        </button>
        <button className="btn btn-outline-secondary btn-sm fw-bold px-3 shadow-sm bg-white" disabled>
          Xóa chức năng
        </button>
      </div>

      <form className="bg-white rounded shadow-sm border overflow-hidden">
        {/* 3. KHU VỰC CHỌN VAI TRÒ */}
        <div className="p-3 border-bottom bg-white">
          <div className="row align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light fw-bold text-secondary">CHỌN VAI TRÒ</span>
                <select className="form-select border-primary fw-bold text-primary">
                  <option value="1">BAN GIÁM ĐỐC</option>
                  <option value="2">KẾ TOÁN</option>
                  <option value="3">NHÂN VIÊN</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BẢNG PHÂN QUYỀN CHÍNH */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle mb-0 custom-table">
            <thead className="table-light text-center">
              <tr>
                <th style={{ width: '60px' }}>STT</th>
                <th style={{ width: '250px' }}>Chức năng</th>
                <th>Các quyền của vai trò</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module, index) => (
                <tr key={module.id}>
                  <td className="text-center fw-bold text-muted">{index + 1}</td>
                  <td className="ps-3 fw-bold text-secondary">{module.name}</td>
                  <td>
                    <div className="p-2">
                      {/* Ô TẤT CẢ */}
                      <div className="form-check mb-2">
                        <input className="form-check-input border-primary" type="checkbox" id={`all-${module.id}`} />
                        <label className="form-check-label fw-bold text-primary" htmlFor={`all-${module.id}`}>
                          Tất cả
                        </label>
                      </div>
                      
                      {/* DANH SÁCH QUYỀN CHI TIẾT */}
                      <div className="d-flex flex-wrap gap-x-4 gap-y-2">
                        {module.permissions.map((p, pIdx) => (
                          <div className="form-check me-3" key={pIdx}>
                            <input 
                              className="form-check-input" 
                              type="checkbox" 
                              id={`p-${module.id}-${pIdx}`} 
                              defaultChecked={p.includes("Xem")} 
                            />
                            <label className="form-check-label small" htmlFor={`p-${module.id}-${pIdx}`}>
                              {p}
                            </label>
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
        .bg-primary { background-color: #5d5fef !important; } /* Màu xanh tím giống hình */
        .uppercase { text-transform: uppercase; }
        .custom-table thead th {
          background-color: #f4f6f9;
          color: #444;
          font-size: 0.85rem;
          padding: 12px;
        }
        .custom-table tbody td {
          border-color: #ebedf2;
        }
        .form-check-input:checked {
          background-color: #5d5fef;
          border-color: #5d5fef;
        }
        .gap-x-4 { column-gap: 1.5rem; }
        .gap-y-2 { row-gap: 0.5rem; }
      `}</style>
    </div>
  );
}