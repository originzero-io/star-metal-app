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
            rowHoverBg: "#d7ecfd",
            rowSelectedBg: "#bae0ff",
            rowSelectedHoverBg: "#bae0ff",

            borderColor: "#dddddd",
            cellFontSizeSM: 12,
            headerColor: "rgba(0, 0, 0, 0.8)",
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
            colorPrimary: "rgb(107,67,175)",
            // colorPrimary: "linear-gradient(72deg, rgba(107,67,175,1) 36%, rgba(225,101,193,1) 87%)",
            colorPrimaryHover: "rgb(128, 84, 206)",
            // colorPrimaryHover: "linear-gradient(72deg, #5d30aa 36%, rgba(224, 75, 187, 0.9) 87%)",
            colorPrimaryActive: "rgb(107,67,175)",
            motionDurationMid: "0s",
            colorLink: "purple",
            colorLinkHover: "#e570f7",
          },
          Tabs: {
            inkBarColor: "#4b00ff",
            itemSelectedColor: "#793fff",
            itemHoverColor: "#793fff",
            lineWidthBold: 3,
            colorBorderSecondary: "#cccccc",
          },
          Collapse: {
            // contentBg: "transparent",
            // headerBg: "rgba(255, 255, 255, 0.5)",
            headerBg: "transparent",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
