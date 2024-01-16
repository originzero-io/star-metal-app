import React from "react";
// import Logo from "assets/images/star-metal-logo.png";
import Logo from "assets/images/logo.png";

export default function CompanyLogo() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <img src={Logo} height={65} width={140} />
    </div>
  );
}
