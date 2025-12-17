/***cấu hình axios call api cho phần trang admin page***/
import axios from "axios";

const axiosAdmin = axios.create({
    //lay dia chi api tu backend -> dia chi root api
    baseURL: "http://localhost:8080/api/backend/",
    headers:{
        "Content-Type": "application/json",
    }
})

export default axiosAdmin;