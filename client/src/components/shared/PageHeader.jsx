import { Badge } from "antd";

export default function PageHeader({ label, icon, dataLength }) {
  return (
    <div
      style={{
        fontSize: "18px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 20,
        color: "#003049",
        letterSpacing: 1,
        padding: 8,
        position: "sticky",
        top: -10,
        background: "#dbe4f9",
        zIndex: "1000",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          marginRight: "10px",
          display: "flex",
        }}
      >
        {icon}
      </div>
      <span>
        {label}{" "}
        {dataLength && <Badge count={dataLength} color="#214472" overflowCount={99999999} />}
      </span>
    </div>
  );
}
