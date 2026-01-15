export interface OrderDetailTypes {
    productId: number;
    quantity: number;
    unitPrice: number;
    promotionId: number;
    orderDetailStatus: number;
    subtotal: number;
}


// Định nghĩa cấu trúc cho Order Payload
export interface OrderPayload {
    cashierId: number;
    customerId: number | undefined;
    paymentTypeId: number | null;
    shipName: string | null;
    shipAddress: string;
    orderDate: Date;
    shippedDate: Date | null;
    paidDate: Date | null;
    status: number;
    shipMethod: string;
    note: string;
    orderDetails: OrderDetailTypes[]; // Sử dụng type bạn đã import
}