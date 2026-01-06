"use client";
import React, { useEffect, useState } from "react";
import { Image } from "react-bootstrap";

export default function BackToTop() {
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
    <div
      onClick={scrollToTop}
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "60px",
        height: "60px",
        zIndex: 2147483647, // Giá trị z-index tối đa của trình duyệt
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        backgroundColor: "rgba(0,0,0,0.1)", // Thêm nền mờ để bạn thấy vùng bấm
        border: "1px solid #ccc"
      }}
    >
      <Image
        alt="Back to top"
        width={40}
        height={40}
        src="/up-arrow.png"
        style={{ 
          pointerEvents: "none",
          userSelect: "none"
        }}
      />
    </div>
  );
}