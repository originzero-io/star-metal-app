import { Tag } from "antd";

export default function IdBadge({ value }) {
  return (
    <Tag bordered={false} style={{ fontSize: "13px" }}>
      {value}
    </Tag>
  );
}
