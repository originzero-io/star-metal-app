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
            // rowHoverBg: "#d7ecfd",
            // rowSelectedBg: "#bae0ff",
            // rowSelectedHoverBg: "#bae0ff",

            rowHoverBg: "rgb(229, 222, 243)",
            rowSelectedBg: "rgb(204, 185, 242)",
            rowSelectedHoverBg: "rgb(204, 185, 242)",

            borderColor: "#dddddd",
            cellFontSizeSM: 12,

            headerBg: "rgb(221, 231, 247)",
            headerColor: "rgba(0, 0, 0, 0.9)",

            colorBgContainer: "rgba(255, 255, 255, 0.6)",
            filterDropdownBg: "#ffff",
          },
          Form: {
            itemMarginBottom: 6,
          },
          Input: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
            colorBgContainerDisabled: "rgba(0, 0, 0, 0.01)",
            colorTextDisabled: "rgba(0, 0, 0)",
            activeBorderColor: "rgb(131, 92, 197)",
            hoverBorderColor: "rgb(131, 92, 197) ",
            // colorBgContainer: "#f8f8f8",
            colorBgContainer: "#ffffffa1",
            borderRadius: 12,
          },
          InputNumber: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
            colorBgContainerDisabled: "rgba(0, 0, 0, 0.01)",
            colorTextDisabled: "rgba(0, 0, 0)",
            activeBorderColor: "rgb(131, 92, 197)",
            hoverBorderColor: "rgb(131, 92, 197) ",
            // colorBgContainer: "#f8f8f8",
            colorBgContainer: "#ffffffa1",
            borderRadius: 12,
          },
          Radio: {
            dotColorDisabled: "#0958d9",
            colorTextDisabled: "rgba(0, 0, 0, 0.7)",
            colorPrimary: "rgb(107,67,175)",
            colorPrimaryHover: "rgb(164, 137, 209)",
            buttonSolidCheckedHoverBg: "rgb(131, 92, 197)",
          },
          Checkbox: {
            colorPrimary: "rgb(107,67,175)",
            colorPrimaryHover: "rgb(145, 115, 196)",
          },
          Select: {
            colorTextPlaceholder: "rgba(0, 0, 0, 0.6)",
            colorPrimary: "rgb(131, 92, 197)",
            colorPrimaryHover: "rgb(131, 92, 197)",
            // colorBgContainer: "#f8f8f8",
            colorBgContainer: "#ffffffa1",
            borderRadius: 12,
          },
          Button: {
            colorPrimary: "rgb(128, 84, 206)",
            colorPrimaryHover: "rgb(147, 105, 220)",
            colorPrimaryActive: "rgb(107,67,175)",
            motionDurationMid: "0s",
            colorLink: "purple",
            colorLinkHover: "#e570f7",
            defaultShadow: "0 5px 10px -5px rgba(0, 0, 0, 0.25)",
            primaryShadow: "0 10px 10px -5px rgba(0, 0, 0, 0.25)",
          },
          Tabs: {
            inkBarColor: "#4b00ff",
            itemSelectedColor: "#793fff",
            itemHoverColor: "#793fff",
            lineWidthBold: 3,
            colorBorderSecondary: "#cccccc",
          },
          Modal: {
            colorBgElevated: "#edf1fb",
          },
          Notification: {
            colorBgElevated: "#edf1fb",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
