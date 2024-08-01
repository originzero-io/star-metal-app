import { Button } from "antd";
import ExcelIcon from "../../../public/excel.png";

export default function ExcelButton({ onClick, ...rest }) {
  return (
    <Button onClick={onClick} {...rest} style={{ fontWeight: "600" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <img src={ExcelIcon} width={20} />
        <div style={{ marginLeft: "10px" }}>İndir</div>
      </div>
    </Button>
  );
}
