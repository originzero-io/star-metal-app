import { Tag } from "antd";

export default function ColumnBadge({ color, value, width = "100%", textAlign = "" }) {
  return (
    <Tag
      bordered={false}
      style={{
        width,
        fontSize: "14px",
        fontWeight: "600",
        background: color,
        padding: "4px",
        textAlign,
      }}
    >
      {value}
    </Tag>
  );
}
