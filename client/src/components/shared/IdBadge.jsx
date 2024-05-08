import { Badge, Tag } from "antd";

export default function IdBadge({ value }) {
  return <Tag style={{ fontSize: "14px" }}>{value}</Tag>;
  // return <Badge count={value} overflowCount={9999999999} color="rgb(45, 115, 245)" />;
}
