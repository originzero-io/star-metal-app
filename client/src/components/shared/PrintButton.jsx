import { PrinterOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

export default function PrintButton({ colorful, handlePrintFunc, ...rest }) {
  const buttonColorType = colorful ? { type: "primary" } : {};
  return (
    <Button icon={<PrinterOutlined />} onClick={handlePrintFunc} {...buttonColorType} {...rest}>
      Yazdır
    </Button>
  );
}
