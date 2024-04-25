import React from "react";
// import Logo from "assets/images/star-metal-logo.png";
import Logo from "assets/images/logo.png";

export default function CompanyLogo({ imgStyle }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <img src={Logo} style={{ maxWidth: "8vw", height: "auto", ...imgStyle }} />
    </div>
  );
}
