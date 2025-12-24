import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";


export default function Pagenotfound403(){
    return <>
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <div className="text-center p-5 shadow-sm rounded bg-white" style={{ maxWidth: '500px' }}>
            <div className="text-danger mb-4">
                <FontAwesomeIcon icon={faTrash} size="4x" /> {/* Thay bằng icon cảnh báo */}
            </div>
            <h2 className="fw-bold">Truy cập bị từ chối</h2>
            <p className="text-muted">Bạn không có quyền xem danh sách tài khoản (USER_VIEW). Vui lòng liên hệ quản trị viên.</p>
            <button className="btn btn-primary mt-3" onClick={() => window.location.href = "/"}>
                Về trang chủ
            </button>
            </div>
        </div>
    </>
}