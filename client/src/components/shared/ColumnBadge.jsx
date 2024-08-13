import { Tag } from "antd";

export default function ColumnBadge({ color, value, width = "100%", textAlign = "" }) {
  return (
    <Tag
      style={{
        width,
        fontSize: "13px",
        fontWeight: "500",
        background: color,
        padding: "4px",
        textAlign,
        border: "1px solid #bdbdbd",
      }}
    >
      {value}
    </Tag>
  );
}
