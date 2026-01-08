// Khai báo interface cho Material (nên đặt trong file types riêng)
export interface MaterialCreateTypes {
    id: number;
    name: string;
    img:string;
    supplier_id: number;
    unit: string;
    quantity: number;
    price: number;
    expire_date: string;
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiRespponseTypes {
    data: MaterialCreateTypes[];
    totalPage: number;
    totalElement: number;
}
