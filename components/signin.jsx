import React, { useEffect, useState } from "react";
import LoginWithSocial from "./loginWithSocial";

export default function Signin() {
  // 1. Ensure these paths are exactly correct in your /public folder
  const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#1a1a1a", // Fallback so it's not white
      }}
    >
      {/* Background Layer */}
      {images.map((img, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: i === index ? 1 : 0,
            transition: "opacity 3s ease-in-out", // The Animation
            zIndex: 1,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      ))}

      {/* Overlay Layer (Darkens the image so you can see the form) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 2,
        }}
      />

      {/* Content Layer */}
      <div className="flex align-items-center justify-content-center h-screen" style={{ position: "relative", zIndex: 3 }}>
        <div className="surface-card p-5 shadow-8 border-round w-full lg:w-4 md:w-6 sm:w-8">
          <div className="text-center mb-5">
            <div className="text-white text-3xl font-semibold mb-3">Welcome to the Divine Portal</div>
          </div>
          <LoginWithSocial />
        </div>
      </div>
    </div>
  );
}
