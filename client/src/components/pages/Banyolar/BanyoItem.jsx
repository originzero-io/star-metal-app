import { useState, useEffect } from "react";
import { FormOutlined, SettingOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { FcComboChart } from "react-icons/fc";
import styled from "styled-components";
import BanyoVeriGirisi from "./BanyoVeriGirisi";
import BanyoTanimlama from "./BanyoTanimlama";
import BanyoParametreleriJSON from "./BanyoParametreleri.json";

const BanyoItemContainerStyled = styled.div``;

const BanyoNameStyled = styled.div`
  text-align: center;
  font-size: 2vmin;
  font-weight: 700;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
`;

export default function BanyoItem({ name }) {
  const [content, setContent] = useState({});

  useEffect(() => {
    const banyoContent = BanyoParametreleriJSON[name];
    setContent(banyoContent);
  }, [name, content]);

  return (
    <BanyoItemContainerStyled>
      <BanyoNameStyled>
        <FcComboChart style={{ fontSize: "3vmin", marginRight: "10px" }} />
        <div>{name} Banyosu</div>
      </BanyoNameStyled>
      <Tabs
        defaultActiveKey="VERI_GIRISI"
        // size="medium"
        centered
        items={[
          {
            label: "Veri Girişi",
            icon: <FormOutlined />,
            key: "VERI_GIRISI",
            children: <BanyoVeriGirisi content={content} />,
          },
          {
            label: "Tanımlama",
            icon: <SettingOutlined />,
            key: "TANIMLAMA",
            children: <BanyoTanimlama content={content} />,
          },
        ]}
      />
    </BanyoItemContainerStyled>
  );
}
