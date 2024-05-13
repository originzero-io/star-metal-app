/* eslint-disable no-nested-ternary */
import PropTypes from "prop-types";
import { Alert, Col, Row, Tag } from "antd";
import { useDBContext } from "context/DBProvider";
import { useEffect, useState } from "react";
import uretimGirisleriHttp from "services/uretim-girisleri.http";
import styled from "styled-components";
import TableGod from "../../../components/shared/TableGod";

const TopSectionItem = styled.div`
  flex: 1 1 400px; // Her öğe en az 200px olacak şekilde esneyebilir
  display: flex;
  align-items: center;
  padding: 4px;
`;

const TopSectionItemName = styled.div`
  width: 20%;
`;
const TopSectionItemValue = styled.div`
  padding: 8px;
  color: rgb(106, 48, 208);
  border-radius: 6px;
  width: 120px;
  text-align: center;
  margin-left: 8px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 2px 3px 8px -8px rgba(0, 0, 0, 0.75);
  border: 1px solid rgb(128, 84, 206);
`;

export default function UretimSevkiyatHareketleri({ record }) {
  const { setLoading, loading } = useDBContext();
  const [uretimGirisleri, setUretimGirisleri] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const uretimResponse = await uretimGirisleriHttp.getDataById(record.id);
      console.log("Üretim Id'ye göre sevkiyat hareketleri: ", Object.entries(uretimGirisleri));
      setUretimGirisleri(uretimResponse);

      setLoading(false);
    }

    fetchData();
  }, [record]);

  const uretimIdsiBazli = Object.entries(uretimGirisleri);

  const columns = [
    {
      title: "Durum",
      // dataIndex: "id",
      key: "durum",
      render: (text, record) =>
        record.sevkTarihi ? (
          <Tag color="green-inverse" style={{ width: "110px", textAlign: "center" }}>
            SEVK EDİLDİ
          </Tag>
        ) : (
          <Tag color="red-inverse" style={{ width: "110px", textAlign: "center" }}>
            SEVK EDİLMEDİ
          </Tag>
        ),
      width: 100,
    },
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Üretim No",
      dataIndex: "uretimSiraNo",
      key: "uretimSiraNo",
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
      title: "Üretim Tarih",
      dataIndex: "uretimTarihi",
      key: "uretimTarihi",
      width: 150,
    },
    {
      title: "Brüt",
      dataIndex: "brut",
      key: "brut",
      // width: 150,
    },
    {
      title: "Dara",
      dataIndex: "dara",
      key: "dara",
      // width: 150,
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
      // width: 150,
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
          }}
        >
          <Col span={4}>
            <img
              alt="referansResim"
              src={`http://localhost:6333/uploads/referanslar/${record?.Referanslar?.resimUrl}`}
              style={{ marginTop: "5%" }}
              height={100}
            />
          </Col>
          <Col span={10}>
            <TopSectionItem>
              <TopSectionItemName>Müşteri: </TopSectionItemName>
              <TopSectionItemValue>{record.Referanslar.musteriAdi}</TopSectionItemValue>
            </TopSectionItem>
            <TopSectionItem>
              <TopSectionItemName>Referans No:</TopSectionItemName>
              <TopSectionItemValue>{record.referansNo}</TopSectionItemValue>
            </TopSectionItem>
            {record.Referanslar.siparisNo ? (
              <TopSectionItem>
                <TopSectionItemName>Sipariş No:</TopSectionItemName>
                <TopSectionItemValue>{record.Referanslar.siparisNo}</TopSectionItemValue>
              </TopSectionItem>
            ) : record.talepNo ? (
              <TopSectionItem>
                <TopSectionItemName>Talep No:</TopSectionItemName>
                <TopSectionItemValue>{record.talepNo}</TopSectionItemValue>
              </TopSectionItem>
            ) : (
              <TopSectionItem>
                <TopSectionItemName>İade: </TopSectionItemName>
                <TopSectionItemValue>{record.iade}</TopSectionItemValue>
              </TopSectionItem>
            )}
          </Col>
          <Col span={10}>
            <TopSectionItem>
              <TopSectionItemName>Parça Adı:</TopSectionItemName>
              <TopSectionItemValue>{record.Referanslar.parcaAdi}</TopSectionItemValue>
            </TopSectionItem>
            <TopSectionItem>
              <TopSectionItemName>İşlem Tipi:</TopSectionItemName>
              <TopSectionItemValue>{record.Referanslar.islemTipi}</TopSectionItemValue>
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
                hideDefaultTitleButtons
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
