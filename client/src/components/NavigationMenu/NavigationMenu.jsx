import { useUIContext } from "context/UIProvider";
import { FaTemperatureLow } from "react-icons/fa";
import { FaDropbox } from "react-icons/fa6";
import { FcInTransit, FcOk, FcRules, FcSynchronize } from "react-icons/fc";
import { GiSteeringWheel } from "react-icons/gi";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { PiUsersThreeBold } from "react-icons/pi";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";

import { AppstoreAddOutlined, CarOutlined } from "@ant-design/icons";
import { Button, Divider } from "antd";
import { useAuth } from "context/AuthProvider";
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
  justify-content: space-between;
  font-weight: 600;

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

const RegisterButtonItemStyled = styled(Button)`
  background: linear-gradient(135deg, rgba(197, 227, 253, 1) 43%, #b6d9f9 100%);

  color: #090909;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  font-size: 1.4vmin;
  margin-bottom: 6px;
  padding: 6px;
  height: 40px;
  border: 1px solid rgb(87, 161, 225);

  &:hover {
    background: linear-gradient(135deg, #d3e9fb 43%, #c9e2fb 100%);
    color: black !important;
    border: 1px solid rgb(87, 161, 225) !important;
  }

  &:active {
    background: rgb(121, 187, 246);
    transform: scale(0.95);
  }
`;

const MenuListGroupItemTitle = styled.div`
  margin-left: 4px;
  font-size: 0.8vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuListGroupItemBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: bold;
  width: 38px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  // box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(168, 168, 168, 0.3);
  color: ${(props) => (!props.selected ? "#4e4e4e" : "white")};
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
  const { user } = useAuth();

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
        user &&
          user.yetki !== "operator" && {
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
      ].filter(Boolean),
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
    [musteriler, referanslar, plakalar, soforler, ambalajlar, personeller, user],
  );

  return (
    <ContainerStyled>
      <div>
        <CompanyLogo />
        <MenuListStyled>
          <LinkStyled to="/gelen-malzeme-kayit" style={{ paddingLeft: 5, paddingRight: 5 }}>
            <RegisterButtonItemStyled
              onClick={() => {
                setSelectedPage("");
              }}
              icon={<AppstoreAddOutlined style={{ fontSize: "1.6vmin", marginRight: -5 }} />}
            >
              Malzeme Kaydı Yap
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
                        <div style={{ display: "flex" }}>
                          <MenuListGroupIcon>{content.icon}</MenuListGroupIcon>
                          <MenuListGroupItemTitle>{content.title} </MenuListGroupItemTitle>
                        </div>
                        {content.dataLength && content.dataLength > 0 ? (
                          <MenuListGroupItemBadge selected={selectedPage === content.link}>
                            {content.dataLength}
                          </MenuListGroupItemBadge>
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
