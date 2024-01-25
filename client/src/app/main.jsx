import "../assets/css/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider, theme } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Table: {
            // rowHoverBg: "#cfd9f0",
            rowHoverBg: "#fbeae8",
            // rowSelectedBg: "#a7bdee",
            rowSelectedBg: "#fde7e4",
            rowSelectedHoverBg: "#f9d2cd",
            // rowSelectedBg: "#cee8fb",
            borderColor: "#d0d0d0",
            cellFontSizeSM: 12,
            headerColor: "rgba(0, 0, 0, 0.8)",
            colorBgContainer: "rgba(255, 255, 255, 0.6)",
            filterDropdownBg: "#fefefe",
            boxShadow: "11 12px 50px rgba(255, 0, 0, 1)",
          },
          Form: {
            itemMarginBottom: 6,
          },
          Input: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
            colorBgContainerDisabled: "rgba(0, 0, 0, 0.01)",
            colorTextDisabled: "rgba(0, 0, 0)",
          },
          Radio: {
            dotColorDisabled: "#0958d9",
            colorTextDisabled: "rgba(0, 0, 0, 0.7)",
          },
          Checkbox: {
            colorPrimary: "rgb(167, 14, 14)",
            colorPrimaryHover: "rgb(195, 18, 18)",
          },
          Select: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
