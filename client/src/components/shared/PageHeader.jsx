import { Badge } from "antd";

export default function PageHeader({ label, icon, dataLength }) {
  return (
    <div
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        // color: "#474747",
        color: "#003049",
        letterSpacing: 1,
        padding: 8,
        position: "sticky",
        top: -10,
        // background: "#4fff",
        background: "#d3e1f7",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          fontSize: "26px",
          marginRight: "10px",
          display: "flex",
        }}
      >
        {icon}
      </div>
      <span>
        {label} <Badge count={dataLength} color="#214472" overflowCount={99999999} />
      </span>
    </div>
  );
}
