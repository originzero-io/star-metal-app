/* eslint-disable no-nested-ternary */
import { Alert, Col, Divider, Row, Tag } from "antd";
import { useDBContext } from "context/DBProvider";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import uretimGirisleriHttp from "services/uretim-girisleri.http";
import styled from "styled-components";
import TableGod from "./shared/TableGod";
import sevkiyatHareketleriHttp from "services/sevkiyat-hareketleri.http";

const TopSectionItem = styled.div`
  flex: 1 1 400px; // Her öğe en az 200px olacak şekilde esneyebilir
  display: flex;
  align-items: center;
  // margin-top: 6px;
  padding: 4px;
  // border-bottom: 1px solid #ccc; // Her öğenin altında bir çizgi
  // background-color: red;
`;

const TopSectionItemName = styled.div`
  width: 20%;
  // background-color: red;
`;
const TopSectionItemValue = styled.div`
  padding: 8px;
  // text-align: center;
  color: #016bcd;
  // color: whitesmoke;
  // color: #4e5b48;
  border-radius: 6px;
  background-color: #bbd5fa;
  // background-color: #3b89f7;
  width: 120px;
  text-align: center;
  margin-left: 8px;
  font-weight: 600;
`;

export default function UretimSevkiyatHareketleri({ record }) {
  const { setLoading, loading } = useDBContext();
  const [uretimGirisleri, setUretimGirisleri] = useState({});
  console.log("record", record);

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

  const createColumnsByReferansNo = (referansNo) => [
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
      render: (text) => text,
      width: 60,
    },
    {
      title: "Üretim No",
      dataIndex: "uretimSiraNo",
      key: "uretimSiraNo",
      render: (text) => text,
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
      render: (text) => text,
      width: 90,
    },
    {
      title: "Üretim Tarih",
      dataIndex: "uretimTarihi",
      key: "uretimTarihi",
      render: (text) => text,
      width: 150,
    },
    {
      title: "Brüt",
      dataIndex: "brut",
      key: "brut",
      render: (text) => text,
      // width: 150,
    },
    {
      title: "Dara",
      dataIndex: "dara",
      key: "dara",
      render: (text) => text,
      // width: 150,
    },
    {
      title: "Sevkiyat Tarihi",
      dataIndex: "sevkTarihi",
      key: "sevkTarihi",
      render: (text) => text,
      width: 150,
    },
    {
      title: "İrsaliye No",
      dataIndex: "irsaliyeNo",
      key: "irsaliyeNo",
      render: (text) => text,
      // width: 150,
    },
    {
      title: "Şoför",
      dataIndex: "sofor",
      key: "sofor",
      render: (text) => text,
      // width: 150,
    },
  ];

  return (
    <div>
      <div onContextMenu={(e) => e.preventDefault()}>
        <Row
          style={{
            background: "#d4e0fa",
            padding: 12,
            borderRadius: 12,
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
            ) : record.Referanslar.talepNo ? (
              <TopSectionItem>
                <TopSectionItemName>Talep No:</TopSectionItemName>
                <TopSectionItemValue>{record.Referanslar.talepNo}</TopSectionItemValue>
              </TopSectionItem>
            ) : (
              <TopSectionItem>
                <TopSectionItemName></TopSectionItemName>
                <TopSectionItemValue style={{ background: "#4887ed", color: "whitesmoke" }}>
                  İADE
                </TopSectionItemValue>
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
        <Divider />
        {uretimIdsiBazli.length > 0 ? (
          uretimIdsiBazli.map(([referansNo, kayitlar], index) => (
            <div key={index}>
              <TableGod
                dataSource={kayitlar}
                columns={createColumnsByReferansNo(referansNo)}
                pagination={false}
                hideDefaultTitleButtons
                // rowStyle={(row) => ({
                //   background: row.sevkTarihi ? "#31b73199" : "#f4e96fe",
                //   cursor: !row.aktif ? "not-allowed" : undefined,
                // })}
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
