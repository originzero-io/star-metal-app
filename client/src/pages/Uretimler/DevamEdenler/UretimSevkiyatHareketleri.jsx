/* eslint-disable no-nested-ternary */
import { PrinterOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Row, Tag, Tooltip } from "antd";
import SevkiyatKarti from "components/cards/SevkiyatKarti";
import IdBadge from "components/shared/IdBadge";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import uretimGirisleriHttp from "services/crud-server/uretim-girisleri.http";
import styled from "styled-components";
import TableGod from "../../../components/shared/TableGod";

const TopSectionItem = styled.div`
  flex: 1 1 400px; // Her öğe en az 200px olacak şekilde esneyebilir
  display: flex;
  align-items: center;
  padding: 4px;
  // background-color: red;
`;

const TopSectionItemName = styled.div`
  width: 40%;
`;
const TopSectionItemValue = styled.div`
  padding: 5px;
  color: black;
  // color: rgb(106, 48, 208);
  border-radius: 6px;
  width: 50%;
  background-color: red;
  text-align: center;
  font-weight: 700;
  font-size: 1.7vmin;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid black;
  // border: 1px solid rgb(128, 84, 206);
`;

export default function UretimSevkiyatHareketleri({ record }) {
  const { setLoading, loading } = useDBContext();
  const { showModal } = useUIContext();
  const [uretimGirisleri, setUretimGirisleri] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const uretimResponse = await uretimGirisleriHttp.getDataByRecord(
        record.id,
        record.referansNo || record.Referanslar.referansNo,
      );
      console.log("Üretim Id'ye göre sevkiyat hareketleri: ", Object.entries(uretimGirisleri));
      setUretimGirisleri(uretimResponse);

      setLoading(false);
    }

    fetchData();
  }, [record]);

  const uretimIdsiBazli = Object.entries(uretimGirisleri);

  const columns = [
    {
      title: "",
      key: "action",
      render: (_, record) =>
        record.sevkTarihi && (
          <Tooltip title="Sevkiyat Kartı Çıkart">
            <Button
              icon={<PrinterOutlined />}
              onClick={() =>
                showModal({
                  title: "Sevkiyat Kartı",
                  content: React.createElement(SevkiyatKarti, {
                    record,
                  }),
                  width: 1200,
                })
              }
            />
          </Tooltip>
        ),
      width: 50,
    },
    {
      title: "Durum",
      // dataIndex: "id",
      key: "durum",
      render: (text, record) =>
        record.sevkTarihi ? (
          <Tag
            color="green-inverse"
            style={{ width: "110px", textAlign: "center", fontSize: "11px" }}
          >
            SEVK EDİLDİ
          </Tag>
        ) : (
          <Tag
            color="red-inverse"
            style={{ width: "110px", textAlign: "center", fontSize: "11px" }}
          >
            SEVK EDİLMEDİ
          </Tag>
        ),
      width: 130,
    },
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Üretim No",
      dataIndex: "uretimId",
      key: "uretimId",
      render: (text) => <IdBadge value={text} />,
      width: 80,
    },
    {
      title: "Üretim Adedi",
      dataIndex: "uretimAdedi",
      key: "uretimAdedi",
      width: 100,
    },
    {
      title: "Personel",
      dataIndex: "personel",
      key: "personel",
      width: 90,
    },
    {
      title: "Üretim Tarihi",
      dataIndex: "uretimTarihi",
      key: "uretimTarihi",
      width: 150,
    },
    {
      title: "Brüt",
      dataIndex: "brut",
      key: "brut",
      width: 70,
    },
    {
      title: "Dara",
      dataIndex: "dara",
      key: "dara",
      width: 70,
    },
    {
      title: "Sevkiyat Tarihi",
      dataIndex: "sevkTarihi",
      key: "sevkTarihi",
      width: 150,
    },
    {
      title: "İrsaliye No",
      dataIndex: "irsaliyeNo",
      key: "irsaliyeNo",
      width: 150,
    },
    {
      title: "Açıklama",
      dataIndex: "aciklama",
      key: "aciklama",
      width: 150,
    },
    {
      title: "Şoför",
      dataIndex: "sofor",
      key: "sofor",
      // width: 150,
    },
    {
      title: "Plaka",
      dataIndex: "plaka",
      key: "plaka",
      // width: 150,
    },
  ];

  return (
    <div>
      <div onContextMenu={(e) => e.preventDefault()}>
        <Row
          style={{
            background: "#e2e9f9",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            boxShadow: "2px 3px 8px -8px rgba(0, 0, 0, 0.75)",
            border: "1px solid #dcdcdc",
            padding: 12,
            borderRadius: 8,
            display: "flex",
            marginBottom: 10,
          }}
          gutter={16}
        >
          <Col span={9}>
            <TopSectionItem>
              <TopSectionItemName>Müşteri: </TopSectionItemName>
              <TopSectionItemValue>
                {record.Referanslar?.musteriAdi || record.musteriAdi}
              </TopSectionItemValue>
            </TopSectionItem>
            <TopSectionItem>
              <TopSectionItemName>Referans No:</TopSectionItemName>
              <TopSectionItemValue>{record.referansNo}</TopSectionItemValue>
            </TopSectionItem>
            <TopSectionItem>
              <TopSectionItemName>Kodu:</TopSectionItemName>
              <TopSectionItemValue>{record.Referanslar?.kodu || record.kodu}</TopSectionItemValue>
            </TopSectionItem>
          </Col>
          <Col span={9}>
            <TopSectionItem>
              <TopSectionItemName>İşlem Tipi:</TopSectionItemName>
              <TopSectionItemValue>
                {record.Referanslar?.islemTipi || record.islemTipi}
              </TopSectionItemValue>
            </TopSectionItem>
            <TopSectionItem>
              <TopSectionItemName>İade: </TopSectionItemName>
              <TopSectionItemValue>{record.iade}</TopSectionItemValue>
            </TopSectionItem>
          </Col>
        </Row>
        {uretimIdsiBazli.length > 0 ? (
          uretimIdsiBazli.map(([uretimId, kayitlar], index) => (
            <div
              key={index}
              style={{
                boxShadow: "2px 3px 8px -8px rgba(0, 0, 0, 0.75)",
                border: "1px solid #dcdcdc",
                borderRadius: 8,
                marginTop: 10,
              }}
            >
              <TableGod
                dataSource={kayitlar}
                columns={columns}
                pagination={false}
                scroll={{ x: 1200 }}
              />
            </div>
          ))
        ) : (
          <Alert description={`Sevkiyat hareketi bulunamadı.`} type="info" showIcon />
        )}
      </div>
    </div>
  );
}

UretimSevkiyatHareketleri.propTypes = {
  record: PropTypes.object.isRequired,
};
