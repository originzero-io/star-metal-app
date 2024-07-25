import { Tag } from "antd";

export default function ColumnBadge({ color, value }) {
  return (
    <Tag
      style={{
        width: "100%",
        fontSize: "13px",
        fontWeight: "500",
        background: color,
        padding: "4px",
      }}
    >
      {value}
    </Tag>
  );
}
