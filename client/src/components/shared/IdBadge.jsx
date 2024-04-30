import { Badge } from "antd";

export default function IdBadge({ value }) {
  return <Badge count={value} overflowCount={9999999999} color="rgb(45, 115, 245)" />;
}
