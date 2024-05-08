import { SyncOutlined } from "@ant-design/icons";
import { Button } from "antd";

export default function LogoSyncButton({ onClick }) {
  return (
    <Button
      onClick={onClick}
      style={{ background: "#08bf8e", color: "white", position: "absolute", left: 8 }}
      icon={<SyncOutlined />}
    >
      Logo ile eşle
    </Button>
  );
}
