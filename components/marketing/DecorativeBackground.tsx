"use client";

export function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Blurred Ellipse */}
      <div
        className="absolute w-[1169px] h-[1140px] left-[136px] top-[258px] rounded-full opacity-64 blur-[125px]"
        style={{
          background: "rgba(249, 249, 229, 0.64)",
        }}
      />

      {/* Rotated Rectangles */}
      <div
        className="absolute w-[682px] h-[565px] left-[-636px] top-[-243px] bg-white rounded-[48px]"
        style={{
          transform: "matrix(0.98, -0.22, 0.3, 0.95, 0, 0)",
        }}
      />
      <div
        className="absolute w-[585px] h-[558px] left-[1007px] top-[347px] rounded-[48px]"
        style={{
          background: "rgba(255, 209, 90, 0.32)",
          transform: "rotate(-155.01deg)",
        }}
      />
      <div
        className="absolute w-[669px] h-[579px] left-[-645px] top-[-341px] rounded-[48px]"
        style={{
          background: "rgba(255, 255, 255, 0.52)",
          transform: "matrix(0.92, -0.4, 0.51, 0.86, 0, 0)",
        }}
      />
      <div
        className="absolute w-[585px] h-[558px] left-[983px] top-[417px] rounded-[48px]"
        style={{
          background: "rgba(255, 255, 255, 0.52)",
          transform: "rotate(-166.97deg)",
        }}
      />
    </div>
  );
}
