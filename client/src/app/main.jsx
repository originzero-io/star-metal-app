import "../assets/css/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowHoverBg: "#cfd9f0",
            rowSelectedBg: "#cee8fb",
            borderColor: "#d0d0d0",
            cellFontSizeSM: 12,
            headerColor: "rgba(0, 0, 0, 0.8)",
            colorBgContainer: "rgba(255, 255, 255, 0.5)",
            // filterDropdownBg: "#fefefe",
            filterDropdownBg: "rgb(222, 227, 237)",
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
            colorPrimary: "rgb(107,67,175)",
            colorPrimaryHover: "rgb(107,67,175)",
          },
          Select: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
          },
          Button: {
            colorPrimary: "linear-gradient(72deg, rgba(107,67,175,1) 36%, rgba(225,101,193,1) 87%)",
            colorPrimaryHover:
              "linear-gradient(72deg, rgba(107,67,175,1) 36%, rgba(225,101,193,1) 87%)",
            colorPrimaryActive: "rgba(107,67,175,1)",
            motionDurationMid: "0s",
            colorLink: "purple",
            colorLinkHover: "#e570f7",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
