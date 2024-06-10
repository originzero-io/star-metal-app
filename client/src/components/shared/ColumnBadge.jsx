import { FileDoneOutlined } from "@ant-design/icons";
import { Tag } from "antd";

export default function ColumnBadge({ color, value }) {
  return (
    <Tag color={color} icon={<FileDoneOutlined />} style={{ width: "100%", fontSize: "12px" }}>
      {value}
    </Tag>
  );
}
