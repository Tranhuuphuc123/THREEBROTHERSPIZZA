"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Chatbox() {
  return (
    <>
      <div className="chatbox-fixed-container">
        <Link href="/client/messenger" className="messengerBtn" title="chat with us">
          <div className="icon-wrapper">
            <FontAwesomeIcon icon={faMessage} className="icon" />
          </div>
          <span className="label">Chat with us</span>
          <span className="ping-effect"></span>
        </Link>
      </div>

      <style jsx global>{`
        /* Container cố định để tránh lỗi lồng thẻ */
        .chatbox-fixed-container {
          position: fixed;
          bottom: 110px; /* Nằm trên nút BackToTop */
          right: 40px;
          z-index: 999998;
        }

        .messengerBtn {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0084ff, #00c6ff);
          color: white !important;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 132, 255, 0.4);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none !important;
          position: relative;
        }

        .icon-wrapper {
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon {
          font-size: 24px;
        }

        /* Hiệu ứng Hover */
        .messengerBtn:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(0, 132, 255, 0.6);
        }

        /* Label hiện ra khi hover */
        .label {
          position: absolute;
          right: 75px;
          background: rgba(0, 0, 0, 0.75);
          color: white;
          padding: 5px 12px;
          border-radius: 8px;
          font-size: 13px;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .messengerBtn:hover .label {
          opacity: 1;
          right: 80px;
        }

        /* Hiệu ứng sóng lan tỏa luôn chạy */
        .ping-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #0084ff;
          border-radius: 50%;
          z-index: 1;
          animation: chat-ping 2s ease-out infinite;
        }

        @keyframes chat-ping {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        /* Responsive Mobile */
        @media (max-width: 768px) {
          .chatbox-fixed-container {
            bottom: 95px;
            right: 20px;
          }
          .messengerBtn {
            width: 50px;
            height: 50px;
          }
          .label { display: none; }
        }
      `}</style>
    </>
  );
}