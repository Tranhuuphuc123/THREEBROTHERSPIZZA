// Khai báo interface cho Material (nên đặt trong file types riêng)
export interface MaterialCreateTypes {
    id: number;
    name: string;
    img:string;
    supplierId: number;
    unit: string;
    quantity: number;
    price: number;
    expireDate: string;
}

/***interface cho dữ kiểu  trả về response của hàm fetchProduct*******/
export interface ApiRespponseTypes {
    data: MaterialCreateTypes[];
    totalPage: number;
    totalElement: number;
}


export interface CreateMatPropsTypes {
   onReload?: () => void; //? truyền cũng đc mà không cũng đc
}

export interface DeleteMatPropsTypes {
    id: number;
    onReload?: () => void;
}

export interface EditMatPropsTypes {
    id: number;
    onReload?: () => void;
}