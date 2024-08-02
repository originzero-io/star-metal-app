import { Tag } from "antd";

export default function CountBadge({ color = "#f9f7fb", children, ...rest }) {
  return (
    <Tag
      color={color}
      style={{
        border: "1px solid #baa1ef",
        color: "black",
        fontWeight: "bold",
        marginLeft: 10,
        borderRadius: 8,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
