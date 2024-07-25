import { Tag } from "antd";

export default function CountBadge({ color = "#f6f1fd", children, ...rest }) {
  return (
    <Tag
      color={color}
      style={{
        border: "1px solid #a782f6",
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
