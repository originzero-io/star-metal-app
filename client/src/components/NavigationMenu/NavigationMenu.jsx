import { useUIContext } from "context/UIProvider";
import { FaTemperatureLow } from "react-icons/fa";
import { FaDropbox } from "react-icons/fa6";
import { FcInTransit, FcOk, FcRules, FcSynchronize } from "react-icons/fc";
import { GiSteeringWheel } from "react-icons/gi";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";

import { CarOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { useDBContext } from "context/DBProvider";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useDetectUserInteraction from "utils/useDetectInteraction.hook";
import CompanyLogo from "../shared/CompanyLogo";
import UserCard from "./UserCard";

const ContainerStyled = styled.div`
  height: 100%;
  width: 11%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  justify-content: space-between;
  overflow-y: auto;

  background-color: rgba(255, 255, 255, 0.2);

  border: 1px solid #c3d1f2;
  border-radius: 8px;

  margin-top: 7px;
  margin-left: 3px;
`;
const MenuListStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 2px;
  margin-top: 20px;
`;
const MenuListGroupStyled = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const MenuListGroupContentStyled = styled.div`
  border-radius: 6px;
  margin-left: 2px;
`;
const MenuListGroupHeaderStyled = styled.div`
  color: #4535aa;
  font-size: 1.3vmin;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
`;
const MenuListGroupItemStyled = styled.div`
  cursor: pointer;
  padding: 5px;
  padding-left: 4px;
  display: flex;
  align-items: center;
  font-weight: 500;

  background: ${(props) =>
    props.selected ? "linear-gradient(to right, #4535aa, #8e82df)" : "transparent"};
  color: ${(props) => (props.selected ? "whitesmoke" : "#4e4e4e")};
  box-shadow: ${(props) => props.selected && "0 10px 20px -5px rgba(0, 0, 0, 0.25)"};
  border-radius: 6px;

  &:hover {
    background: ${(props) => !props.selected && "rgb(185, 200, 239)"};
    color: ${(props) => !props.selected && "#622ce0"};
  }
`;

const RegisterButtonItemStyled = styled.div`
  font-weight: 600;
  font-size: 1.5vmin;

  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  border-radius: 12px;

  margin-bottom: 10px;
  background: linear-gradient(to right, #4535aa, #8e82df);
  color: #e8e8e8;
  padding: 8px;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.25);

  &:hover {
    background: linear-gradient(to right, #4535aa, #a198e0);
  }
`;

const MenuListGroupItemTitle = styled.div`
  margin-left: 6px;
  font-size: 0.8vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90px;
`;

const MenuListGroupItemBadge = styled.div`
  margin-left: 6px;
  background: #002f49bf;
  padding: 3px 4px;
  color: white;
  border-radius: 12px;
  font-size: 10px;
  width: 38px;
  text-align: center;
  border: 1px solid white;
`;
const MenuListGroupTitleStyled = styled.div`
  margin-left: 2px;
`;
const MenuListGroupIcon = styled.div`
  font-size: 18px;
  display: flex;
  padding: 4px;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
`;

function NavigationMenu() {
  useDetectUserInteraction();

  const { showPanel, selectedPage, setSelectedPage } = useUIContext();
  const { musteriler, referanslar, ambalajlar, soforler, plakalar, personeller } = useDBContext();

  const pages = useMemo(
    () => ({
      categories: [
        {
          title: "ÜRETİM TAKİBİ",
          key: "uretim",
        },
        {
          title: "TANIMLAMALAR",
          key: "tanimlamalar",
        },
        // {
        //   title: "Veriler",
        //   key: "veriler",
        // },
      ],
      uretim: [
        // {
        //   title: "Gelen Malzeme Kaydı",
        //   icon: <FolderAddTwoTone twoToneColor="#5c0099" />,
        //   link: "/gelen-malzeme-kayit",
        // },
        {
          title: "Devam Edenler",
          icon: <FcSynchronize />,
          link: "/uretim/devam-eden",
        },
        {
          title: "Sevk Edilecekler",
          icon: <FcInTransit />,
          link: "/uretim/sevk-edilecekler",
        },
        {
          title: "İrsaliye Kesilecekler",
          icon: <FcRules />,
          link: "/uretim/irsaliye-sayfasi",
        },
        {
          title: "Tamamlananlar",
          icon: <FcOk />,
          link: "/uretim/tamamlanan",
        },
        // {
        //   title: "Üretim Raporu",
        //   icon: <FcPieChart />,
        //   link: "/uretim/rapor",
        // },
      ],
      tanimlamalar: [
        {
          title: "Müşteriler",
          icon: <RiCustomerServiceLine />,
          link: "/musteriler",
          dataLength: musteriler.length,
        },
        {
          title: "Referanslar",
          icon: <MdOutlineDocumentScanner />,
          link: "/referanslar",
          dataLength: referanslar.length,
        },
        {
          title: "Ambalajlar",
          icon: <FaDropbox />,
          link: "/ambalajlar",
          dataLength: ambalajlar.length,
        },
        {
          title: "Personeller",
          icon: <PiUsersThreeBold />,
          link: "/personeller",
          dataLength: personeller.length,
        },
        {
          title: "Şoförler",
          icon: <GiSteeringWheel />,
          link: "/soforler",
          dataLength: soforler.length,
        },
        {
          title: "Plakalar",
          icon: <CarOutlined />,
          link: "/plakalar",
          dataLength: plakalar.length,
        },
      ],
      veriler: [
        {
          title: "Sıcaklık",
          icon: <FaTemperatureLow />,
          link: "/sicakliklar",
        },
        {
          title: "Banyolar",
          icon: <TbRulerMeasure />,
          link: "/banyo-degerleri",
        },
        {
          title: "Butonlar",
          icon: <TbRulerMeasure />,
          link: "/butonlar",
        },
      ],
    }),
    [musteriler, referanslar, plakalar, soforler, ambalajlar, personeller],
  );

  return (
    <ContainerStyled>
      <div>
        <CompanyLogo />
        <MenuListStyled>
          <LinkStyled to="/gelen-malzeme-kayit">
            <RegisterButtonItemStyled
              onClick={() => {
                setSelectedPage("");
              }}
            >
              Gelen Malzeme Kaydı
            </RegisterButtonItemStyled>
          </LinkStyled>
          {pages.categories.map((category, i) => (
            <div key={i}>
              <Divider style={{ marginTop: "4px", marginBottom: "4px", background: "#c3d1f2" }} />
              <MenuListGroupStyled key={i}>
                <MenuListGroupHeaderStyled>
                  <div style={{ display: "flex", alignItems: "center", fontSize: "1.7vmin" }}>
                    {category.icon}
                  </div>
                  <MenuListGroupTitleStyled>{category.title}</MenuListGroupTitleStyled>
                </MenuListGroupHeaderStyled>
                <MenuListGroupContentStyled>
                  {pages[category.key].map((content, i) => (
                    <LinkStyled
                      key={i}
                      to={content.link}
                      onClick={() => setSelectedPage(content.link)}
                    >
                      <MenuListGroupItemStyled
                        selected={selectedPage === content.link}
                        onClick={() => {
                          showPanel(false);
                        }}
                      >
                        <MenuListGroupIcon>{content.icon}</MenuListGroupIcon>
                        <MenuListGroupItemTitle>{content.title} </MenuListGroupItemTitle>
                        {content.dataLength && content.dataLength > 0 ? (
                          <MenuListGroupItemBadge>{content.dataLength}</MenuListGroupItemBadge>
                        ) : null}
                      </MenuListGroupItemStyled>
                    </LinkStyled>
                  ))}
                </MenuListGroupContentStyled>
              </MenuListGroupStyled>
            </div>
          ))}
        </MenuListStyled>
      </div>
      <UserCard />
    </ContainerStyled>
  );
}

export default NavigationMenu;
