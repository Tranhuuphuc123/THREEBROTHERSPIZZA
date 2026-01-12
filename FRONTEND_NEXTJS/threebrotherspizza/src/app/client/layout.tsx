"use client";

import "./client.css";

import Header from "@/components/client/header";
import Footer from "@/components/client/footer";
import BackToTop from "@/components/client/BackToTop";
import { useEffect, useState } from "react";

/*import component chatbox messenger zalo vào*/
import Chatbox from "@/components/client/chatbox";

//import cartContext bao bọc hết client page 
import {CartProvider} from '@/contexts/cartContext'


export default function RootClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    const scrollToTop = (e: any) => {
      // Ép trình duyệt thực hiện cuộn bất kể chuyện gì xảy ra
      console.log("Hệ thống đã nhận lệnh click!");
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };
  
    if (!mounted) return null;

    
  return (
    <>
    {/* CartProvider là tk cart chuẩn context á */}
      <CartProvider>
        {/* phan header */}
        <Header />

        {/* phan body */}
        {children}

        {/* Thêm component Chatbox */}
        <Chatbox />


        {/* phan footer */}
        <Footer />

        {/* Icon backto top mũi tên quay về trang chủ khi mà scroll xuống cúi trang */}
        <BackToTop />
      </CartProvider>
    </>
  );
}
