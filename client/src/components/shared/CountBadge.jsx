import { Badge } from "antd";

export default function CountBadge({ count, offset, color = "#002f49bf", children, ...rest }) {
  return (
    <Badge count={count} offset={offset} color={color} overflowCount={99999} {...rest}>
      {children}
    </Badge>
  );
}
