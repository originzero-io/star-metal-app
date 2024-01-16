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
            rowHoverBg: "#cfd9f0",
            rowSelectedBg: "#a7bdee",
            borderColor: "#d0d0d0",
            cellFontSizeSM: 12,
            headerColor: "rgba(0, 0, 0, 0.8)",
            //cellFontSizeSM: 13,
            colorBgContainer: "rgba(255, 255, 255, 0.6)",
            filterDropdownBg: "#fefefe",
            boxShadow: "11 12px 50px rgba(255, 0, 0, 1)",
          },
          Form: {
            itemMarginBottom: 6,
          },
          Input: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
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
