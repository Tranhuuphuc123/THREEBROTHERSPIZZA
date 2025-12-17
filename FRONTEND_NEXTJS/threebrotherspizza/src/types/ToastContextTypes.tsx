/**khai báo interfaces types cho modalToast tự viết thông báo***/
export interface ToastContextTypes {
  // Phương thức để gọi thông báo từ bất kỳ đâu
    showToast: (type: string, message: string) => void;
}
