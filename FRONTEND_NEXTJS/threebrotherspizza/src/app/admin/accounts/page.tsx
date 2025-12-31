/*
  => khai bao import lib cua NextJs - 'use client' dùng để gọi API theo chuẩn NextJs 13 trở đi
  => useState, useEffect: dùng để khai báo states và lifecycle của component
   + useState: khai báo states ghi nhận trạng thái là các value cho biến state có tên
    là listProduct
   + useEffect: khai báo lifecycle của component
*/

/* qui trinh code nexttj -> sắp xếp code theo bó cục 
 1. khai báo import lib 
 2. khai báo const function chinh
   +a/ khai báo state
   +b/ khai báo function - method  xử lý sự kiện 
   +c/ khai báo useEffect  
   +d/ return giao diện render HTML/CSS

 3. export default function chinh xuât function chính ra 
*/

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import React from "react";

//import interface types định kiểu dữ liệu 
import {AccountTypes, ApiResponseTypes} from '@/types/AccountTypes'

//su dung lib axios call api ben client NextJs
import axiosAdmin from "@/axios/axiosAdmin";

//sử dụng icon của lib fontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faPenToSquare,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";

//import Modal từ lib Modal react-boostrap
import Modal from "react-bootstrap/Modal";
//khai bao import ModalContext mau context chung vao: luu ý import cai useModal hook ở qt3
import { useModal } from "@/contexts/ModalContext";

//import page form create product(form create tự thiết kế bằng bootstrap)
import CreateModal from "@/app/admin/accounts/create/page";
//import page form delete product
import DeleteModal from "@/app/admin/accounts/delete/page";
//import form edit products
import UpdateModal from "@/app/admin/accounts/edit/page";

//import giao diện Pagenotfound403 báo lỗi khi không có quyền
import Pagenotfound403 from '@/components/admin/notfound403'

//make variale api url file upload img
import { UPLOAD_URL } from "@/constants/urls";
/* import constants permissionsName.tsx lấy list tên các quyền cần text
cho username coi quyền lây đc ở username trong localstorage có khớp với 
quyền có trong file permissionName.tsx không */
import {USER_CREATE, USER_UPDATE, USER_DELETE} from '@/constants/permissionsName'




export default function AccountsManage () {
  /********state cho modal add cho page product ******/
  /****b1 - khởi tạo giá trị ban đầu (States) của các component bên trong trang****/
  //state cho hiển thị cá values trong table products ra client
  const [listAccount, setListAccount] = useState<AccountTypes[]>([]);

  //state trạng thái ghi nhan id của cái products value cần xóa chọn đúng cái càn xóa qua id
  const [selectedId, setSelectedId] = useState<number | null>(null);

  //state trạng thái xóa hàng loạt khi checkbox được chọn
  //number[]: định kiểu types trong tsx với [] là dùng để khai báo cho type là một mảng các value
  const [listSelectedId, setListSelectedId] = useState<string[]>([]);

  /************************state quan ly trang thai phân  trang********************/
  //state lấy trang page hiện tại -> mac dinh la page 1
  //<type>: định kiểu dữ liệu dùng trong tsx
  const [currentPage, setCurrentPage] = useState<number>(1);
  //state lay tong so page hien thi len giao dien
  const [totalPage, setTotalPage] = useState<number>(1);
  //state lay tong so value(phan tu) /tat ca trang
  const [totalElement, setTotalElement] = useState<number>(0);
  // state pageSize: qui tinh mot page co nhieu phan tu khi hien thi len
  const pageSize = 3;

  /**********state trang thái tiềm kiếm theo tên******* */
  //state lưu trữ từ khóa tiềm kiếm
  const [searchQuery, setSearchQuery] = useState<string>("");
  //state lưu trữ từ khóa tiềm kiếm sau khi đã bị delay
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  /**state trang thai dung voi useModal cua ModalContext:
   * => lưu ý: openModal và closeMOdal trong modalcontext là một hàm method xử lý
   * bật và tắt modal nên khỏi cần viết lại các method như handleShow/Hide chi nữa
   * vì bản chât openModal closeModal là method rồi đay page này ta chỉ gọi đến nó
   * kiểu kế thừa nó và sử dụng thui vì modal context đã viết định nghĩa chung hết rồi
   * =>  monoType đẻ chỉ đinh modal là create/delete/edit.. khi mở giúp có thể tái sử dụng
   * nhiều lần modalContect mà khong bị lỗi dó có chỉ định cụ thẻ là đang open modalCOntext
   * là type nào(create/delete/edit... cụ thể tránh hiểu lầm mở lần nó hiểu sai là mở
   * cùng lúc tất cả modal create/delete và edit một lượt nếu không có type phân loại)
   * **/
  //as ModalContextType: định kiểu dữ liệu cho modalContextType
  const { openModal, closeModal, show, modalType } = useModal();


  /*Khai báo state để kiểm tra quyền*/
  // const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  /* Lấy danh sách quyền từ localStorage
   >> giải thích code<<<
    # typeof window !== 'undefined' (Kiểm tra môi trường): 
     + Next.js chạy ở hai nơi: Server (Node.js) và Client (Trình duyệt).
     + Vấn đề: Đối tượng window và localStorage chỉ tồn tại ở trình duyệt. 
     Nếu bạn gọi localStorage trực tiếp ở Server, Next.js sẽ báo lỗi ngay 
     lập tức vì Server không hiểu "localStorage" là gì.
     + Ý nghĩa: Dòng này kiểm tra xem code có đang chạy ở trình duyệt hay
      không. Nếu window khác undefined, nghĩa là chúng ta đang ở phía Client.
      
    # Toán tử 3 ngôi ? : (Quyết định hành động)
      + Nếu đúng (?): Nếu đang ở Client, hãy thực hiện localStorage.getItem('permissions') || "".
      + nếu sai server trả về chuỗi rỗng  
      
    # localStorage.getItem('permissions'): lấy quyền ở key permission lưu trong localstorage  
  */
  const strPermission = typeof window !== 'undefined' ? localStorage.getItem('permissions') || "" : "";

  // Kiểm tra quyền cụ thể cho từng hành động của các button add,, edit và del khong có thì ẩn button luôn
  const canCreate = strPermission.includes(USER_CREATE);
  const canUpdate = strPermission.includes(USER_UPDATE);
  const canDelete = strPermission.includes(USER_DELETE);


  /************************************Các method tự viết*******************************/
  /**method xử lý ẩn/hiện modal delete form dúng voi id của value đc chọn**/
  /*e: React.MouseEvent<HTMLButtonElement>: định kiểu dữ liệu của event click
    vì sự kiện là button nên event nó là click mouse event*/
  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    //ghi nhận lấy id đúng id của vlaue mình muốn xóa
    const id = e.currentTarget.getAttribute("data-id");
    if (id) {
      // Dấu '+': Đây là cách ép kiểu (casting) từ string sang number sẽ ép string sang number
      setSelectedId(+id); 
      //goi state openModal context -> show modal len vs type cua modal delete
      openModal("delete");
    }
  };

  /**method xử lý ẩn/hiện nút deleteAll button - xóa hàng loạt khi tick vào ô checkbox ứng vói id
   * tương ứng thì nó mới hiện cái button deleteAll còn bt thì nó ẩn đi**/
  /*(e: React.ChangeEvent<HTMLInputElement>): định kiểu dữ liệu của event click -> vì sự kiện là thẻ 
    input nên no có event là onchange*/
  const handleDeleteAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    //ghi nhan value khi tick vao o checkbox la id
    const id = e.target.value;
    /*giải thích code:
         + prev: giá trị biến hiện tại của state listSelectedId
         + prev.includes(id): kiểm tra xem id có nằm trong mảng listSelectedId hay không
         + prev.filter((item) => item != id):  nếu id có trong mảng listSelectedId thì nó sẽ bị filter 
         lọc ra 
         +  [...prev, id] : thêm id vào mảng listSelectedId nếu id không nằm trong mảng prev
         --> (ý nghĩa đoạn sau? là nó giúp kiêm tra khi tick vào ô checkbox thì nó ghi nhận và hiển ra nut deleteall
         còn nếu bỏ tick nó ẩn đi nút deleteall vì lúc này id không nằm trong mảng listSelectedId)
        */
    setListSelectedId((prev) =>
      prev.includes(id) ? prev.filter((item) => item != id) : [...prev, id]
    );
  };

  /**method xử lý mở modal deleteAll form khi click vào button deleteAll**/
  const handelBatchDeleteAll = () => {
    openModal("batch-delete");
  };

  /**method xử lý ẩn/hiện modal editproduct Form khi clickl vào button edit**/
  /*e: React.MouseEvent<HTMLButtonElement>: định kiểu dữ liệu của event click
    khi sự kiện là button click thì event nó là click mouse event*/
  const handleOpenEditModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    //ghi nhận lấy id đúng id của vlaue mình muốn edit
    const id = e.currentTarget.getAttribute("data-id");
    if (id) {
        // Dấu '+': Đây là cách ép kiểu (casting) từ string sang number sẽ ép string sang number
        setSelectedId(+id); 
        openModal("edit");
    }
  };


 
  /******************xử lý phân trang**************************** */
  //tạo mảng chứa số trang để hiển thị ra giao diện
  const pageNumbers = [];
  for (let i = 1; i <= totalPage; i++) {
    pageNumbers.push(i);
  }

  /**method handlePageChange: xu ly nguoi dung thay doi trang**/
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
  };

  /***method fetchAccounts: gọi api xử lý phân trang và search: theo ten va theo ma***/
  //ApiResponseTypes: định kiểu dữ liệu trả về từ api
  const fetchAccounts = async () => {
    const res = await axiosAdmin.get<ApiResponseTypes>('/users', {
      params: {
        pageNumber: currentPage,
        pageSize: pageSize,
        search: debouncedSearchQuery, //điều kiện tiềm kiếm
      },
    });
    // lap dieu kien kiem tra tranh null khi tiem kiem theo ten va theo ma
    if (res.data.data == null) {
      setListAccount([]);
    } else {
      //update ds value tren csdl vao table users
      setListAccount(res.data.data); 
    }
    setTotalPage(res.data.totalPage); //lay tong so page cap nhat ngay
    setTotalElement(res.data.totalElement); //lay tong so value cap nhat ngay
  };


   /*method handReload: reload lại trang sau khi create/edit/delete xong*/
  const handleReload = () => {
    fetchAccounts();
  };


  // /* Kiểm tra quyền trong useEffect (chỉ chạy ở Client)*/
  // useEffect(() => {
  //   if (!strPermission || !strPermission.includes(USER_VIEW)) {
  //     setIsAuthorized(false);
  //   } else {
  //     setIsAuthorized(true);
  //   }
  //   /*đưa strPermission vào mảng dependency của useEffect [] để kiểm tra
  //    isAuthorized cái quyền á, đảm bảo nếu có sự thay đổi quyền, trang 
  //    web sẽ phản ứng ngay */
  // }, [strPermission]);


  /**useEffect thực setTimeOUt -> sau 500ms thì mới thực hiện search theo api**/
  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // reset phan trang về page 1
    }, 500);
    return () => clearTimeout(delayInputTimeoutId);
  }, [searchQuery]);


  //  useEffect: thưc thi goi api xử lý phân trang và search: theo ten va theo ma
  useEffect(() => {
    fetchAccounts();
  }, [currentPage, debouncedSearchQuery]);


  /**********************xử lý render giao diện với kiểm tra permission******************* */
  // /*  Xử lý logic render chặn truy cập*/
  // if (isAuthorized === null) {
  //   return <div>Đang tải...</div>; // Chờ kiểm tra localStorage
  // }

  // if (isAuthorized === false) {
  //   return <Pagenotfound403 />; // Trả về component lỗi, chặn toàn bộ code bên dưới
  // }

  /* Nếu isAuthorized === true, code bên dưới mới được chạy*/
  return (
    //mục này mình đưa trang dashboard vào đay
    <>
      <div className="mb-3">
        <h3>Danh sách sản phẩm</h3>
      </div>

      {/* mục giao diện chức năng tiềm kiếm trang product search */}
      <div className="card p-3 manage-employees">
        <div className="row align-items-center mb-3 mx-1">
          <div className="col-sm-12 p-0">
            <h5 className="ml-lg-2">Bộ lộc tiềm kiếm</h5>
            <div className="form-group">
              <label className="me-2">Tên Accounts</label>
              <input
                type="text"
                placeholder="Nhập tên"
                className="form-control w-100 w-md-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* giao diện table Accounts */}
      <div className="card p-3 manage-employees">
        <div className="row align-items-center mb-3 mx-1">
          <div className="col-12 col-sm-6 p-0 mb-2 mb-sm-0">
            <h5 className="ml-lg-2">Manage Accounts</h5>
          </div>
          <div className="col-12 col-sm-6 p-0 text-start text-sm-end">

            {/* CHỈ HIỆN NÚT ADD NẾU CÓ QUYỀN CREATE */}
            {canCreate && (
               <button
                className="btn btn-success me-2 mb-2 mb-sm-0"
                onClick={() => openModal("create")}
              >
                <FontAwesomeIcon icon={faPlus} className="fa-fw" />
                <span>Add New Accounts</span>
              </button>
            )}
           
           {/* CHỈ HIỆN NÚT DELETE ALL NẾU CÓ QUYỀN DELETE VÀ CÓ ITEM ĐƯỢC CHỌN */}
            {canDelete && listSelectedId.length > 0 && (
              <button
                className="btn btn-danger led-toggler"
                data-toggle="modal"
                onClick={handelBatchDeleteAll}
              >
                <FontAwesomeIcon icon={faTrash} className="fa-fw" />
                <span>Delete All</span>
              </button>
            )}

          </div>
        </div>

        <div className="table-responsive">
          <table className="table led-table">
            <thead>
              <tr>
                <th></th>
                <th>Avatar</th>
                <th>username</th>
                <th>gender</th>
                <th>birthday</th>
                <th>email</th>
                <th>phone</th>
                <th>address</th>
                <th>levelID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
                {listAccount.map((acc) => (
                  <tr key={acc.id}>
                    <td>
                      <input type="checkbox" value={acc.id} onChange={handleDeleteAllCheckbox} />
                    </td>
                    <td>
                      <Image 
                        src={`${UPLOAD_URL}/${acc.avatar}`} 
                        alt="avatar" width={50} height={50} 
                        className="rounded-circle"
                      />
                    </td>
                    <td>{acc.username}</td>
                    <td>{acc.gender === 1 ? "Nam" : "Nữ"}</td>
                    <td>{acc.birthday}</td>
                    <td>{acc.email}</td>
                    <td>{acc.phone}</td>
                    <td>{acc.address}</td>
                    <td>{acc.levelId}</td>
                    <td>
                        <div className="d-flex gap-2">
                            {/* KIỂM TRA QUYỀN TRƯỚC KHI HIỂN THỊ CỘT ACTIONS */}
                            {canDelete && (
                                <button className="btn btn-danger btn-sm" data-id={acc.id} onClick={handleDeleteButtonClick}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                            )}
                            {/* KIỂM TRA QUYỀN UPDATE NẾU KHÔNG CÓ THÌ ẨN */}
                            {canUpdate && (
                                <button className="btn btn-warning btn-sm" data-id={acc.id} onClick={handleOpenEditModal}>
                                  <FontAwesomeIcon icon={faPenToSquare} />
                              </button>
                            )}
                        </div>
                      </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* giao dien xu ly phan trang */}
        <div className="pagination-container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
          <div className="pagination-info text-center text-sm-start">
            Trang {currentPage}/{totalPage} - Tổng:
            {totalElement} sản phẩm
          </div>
          <div className="pagination-control d-flex justify-content-center">
            <button
              className="pagination-button"
              disabled={currentPage == 1}
              onClick={() => handlePageChange(1)}
            >
              <FontAwesomeIcon icon={faAngleDoubleLeft} className="fa-fw" />
            </button>
            <button
              className="pagination-button"
              disabled={currentPage == 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <FontAwesomeIcon icon={faAngleLeft} className="fa-fw" />
            </button>

            {pageNumbers.map((page) => {
              return (
                <button
                  key={page}
                  className={`pagination-button ${
                    currentPage == page ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="pagination-button"
              disabled={currentPage == totalPage}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <FontAwesomeIcon icon={faAngleRight} className="fa-fw" />
            </button>
            <button
              className="pagination-button"
              disabled={currentPage == totalPage}
              onClick={() => handlePageChange(totalPage)}
            >
              <FontAwesomeIcon icon={faAngleDoubleRight} className="fa-fw" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal show={show && modalType === "create"} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới accounts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateModal onReload={handleReload} />
        </Modal.Body>
      </Modal>

      <Modal show={show && modalType === "delete"} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa {selectedId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Nếu selectedId khác null thì mới hiện Form, 
            để tránh truyền id là 0 hoặc rỗng vào API 
          */}
          {selectedId !== null ? (
            <DeleteModal id={selectedId} onReload={handleReload} />
          ) : (
            <p>Không tìm thấy dữ liệu để xóa</p>
          )}
        </Modal.Body>
      </Modal>


      <Modal show={show && modalType === "edit"} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Account - edit value {selectedId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Nếu selectedId khác null thì mới hiện Form, 
            để tránh truyền id là 0 hoặc rỗng vào API 
          */}
          {selectedId !== null ? (
            <UpdateModal id={selectedId} onReload={handleReload} />
          ) : (
            <p>Không tìm thấy dữ liệu để xóa</p>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

