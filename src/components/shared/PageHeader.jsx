import { useUIContext } from "context/UIProvider";
import React from "react";

export default function PageHeader() {
  const { pageHeader } = useUIContext();
  return (
    <div
      style={{
        fontSize: "2.2vmin",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontSize: "3vmin",
          fontWeight: "bold",
          marginRight: "10px",
          display: "flex",
          // background: "red",
        }}
      >
        {pageHeader.icon}
      </div>

      <span>{pageHeader.title}</span>
    </div>
  );
}
