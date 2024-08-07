import { CaretRightOutlined } from "@ant-design/icons";
import { Button, Collapse, Divider, Flex, Form, Input, Modal, Select } from "antd";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import TableGod from "components/shared/TableGod";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import { FcRules } from "react-icons/fc";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import uretimGirisleriHttp from "services/crud-server/uretim-girisleri.http";
import { devamEdenUretimHttp, tamamlananUretimHttp } from "services/crud-server/uretimler.http";
import logoGoApi from "services/logoGoApi";
import { getCurrentDateTime, getCurrentTimeWithLogoFormat } from "utils/time.helper";

export default function Irsaliyeler() {
  const { irsaliyeler, setIrsaliyeler, setDevamEdenUretimler } = useDBContext();
  const { showNotification } = useUIContext();

  const sevkIrsaliyeleri = irsaliyeler?.filter((irsaliye) => irsaliye.tip === "sevk");
  const tasimaIrsaliyeleri = irsaliyeler?.filter((irsaliye) => irsaliye.tip === "tasima");

  const [tipBazliIrsaliye, setTipBazliIrsaliye] = useState({ tasima: {}, sevk: {} });

  const tipeGoreGrupla = () => {
    const tipBazliGruplama = irsaliyeler.reduce((acc, item) => {
      // Tip'e göre gruplama
      if (!acc[item.tip]) {
        acc[item.tip] = {};
      }

      // Firma adına göre gruplama
      const firma = item.fasona ? item.Referanslar.fasonFirmasi : item.Referanslar.musteriAdi;

      if (!acc[item.tip][firma]) {
        acc[item.tip][firma] = [];
      }

      acc[item.tip][firma].push(item);

      return acc;
    }, {});

    setTipBazliIrsaliye(tipBazliGruplama);
  };

  const columns = useMemo(
    () => [
      {
        title: "Üretim ID",
        dataIndex: "uretimId",
        key: "uretimId",
        render: (text) => <IdBadge value={text} />,
        sorter: (a, b) => a.uretimId - b.uretimId,
        width: 100,
      },
      {
        title: "Üretim Girişi IDler",
        dataIndex: "uretimGirisiIdleri",
        key: "uretimGirisiIdleri",
        render: (text) => <IdBadge value={text} />,
        width: 100,
      },
      {
        title: "Kodu",
        dataIndex: "kodu",
        key: "kodu",
        render: (text, record) => <ColumnBadge value={record.Referanslar.kodu} />,
        width: 135,
      },
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        render: (text) => <ColumnBadge value={text} />,
        width: 120,
      },
      {
        title: "İade",
        dataIndex: "iade",
        key: "iade",
      },
      {
        title: "İrsaliye Açıklaması",
        dataIndex: "irsaliyeAciklamasi",
        key: "irsaliyeAciklamasi",
        render: (text, _record) => _record?.Referanslar?.irsaliyeAciklamasi,
        // width: 150,
      },

      {
        title: "Üretim Adedi",
        dataIndex: "uretimAdedi",
        key: "uretimAdedi",
        width: 100,
      },
      {
        title: "1. Ambalaj",
        dataIndex: "birinciAmbalaj",
        key: "birinciAmbalaj",
        // width: 120,
      },
      {
        title: "2. Ambalaj",
        dataIndex: "ikinciAmbalaj",
        key: "ikinciAmbalaj",
        // width: 120,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        render: (text, record) => (
          <ColumnBadge
            color={record.Referanslar.siparisTipi === "SERİ" ? "#e1f2fa" : "#fcf2e9"}
            value={record.Referanslar.siparisTipi}
          />
        ),
        width: 100,
      },
    ],
    [irsaliyeler],
  );

  const secilenKaydiSil = (kayit) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili irsaliye kayıtlarını silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newReferanslar = await irsaliyeHttp.deleteData(irsaliyeler, [kayit]);

          await uretimGirisleriHttp.aktiflikDegistir(true, [kayit]);

          const devamEdenUretimler = await devamEdenUretimHttp.getData();
          setDevamEdenUretimler(devamEdenUretimler);
          setIrsaliyeler(newReferanslar);

          showNotification(
            "success",
            `${kayit.Referanslar.musteriAdi} müşterine ait seçili irsaliye kaydı silindi.`,
          );
        } catch (error) {
          showNotification("error", `Hata oluştu: ${error.message}`);
        }
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  useEffect(() => {
    tipeGoreGrupla();
  }, [irsaliyeler]);

  return (
    <div>
      <PageHeader label="İrsaliye Kesilecekler" icon={<FcRules />} />
      <Collapse
        bordered={false}
        defaultActiveKey={["sevk", "tasima"]}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={[
          {
            key: "sevk",
            label: (
              <Flex align="center">
                <div style={collapseStyle.parentCollapseHeader}>Sevk İrsaliyeleri</div>
                <CountBadge>{sevkIrsaliyeleri.length}</CountBadge>
              </Flex>
            ),
            style: collapseStyle.parentCollapseItem,
            children: (
              <Collapse
                bordered={false}
                size="small"
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                defaultActiveKey={Object.keys(tipBazliIrsaliye).map((_, index) => index.toString())}
                items={
                  tipBazliIrsaliye.sevk &&
                  Object.entries(tipBazliIrsaliye.sevk).map(([musteriAdi, kayitlar], index) => ({
                    key: index.toString(),
                    label: (
                      <Flex align="center">
                        <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                        <CountBadge>{kayitlar.length}</CountBadge>
                      </Flex>
                    ),
                    children: (
                      <IrsaliyeTablo
                        data={kayitlar}
                        columns={columns}
                        deleteRecordsFunc={secilenKaydiSil}
                      />
                    ),
                    style: collapseStyle.subCollapseItem,

                    extra: <LogoyaGonderButon kayitlar={kayitlar} />,
                  }))
                }
              />
            ),
          },
          {
            key: "tasima",
            label: (
              <Flex align="center">
                <div style={collapseStyle.parentCollapseHeader}>Fason & İade İrsaliyeleri</div>
                <CountBadge>{tasimaIrsaliyeleri.length}</CountBadge>
              </Flex>
            ),

            style: collapseStyle.parentCollapseItem,

            children: (
              <Collapse
                bordered={false}
                size="small"
                defaultActiveKey={Object.keys(tipBazliIrsaliye).map((_, index) => index.toString())}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                items={
                  tipBazliIrsaliye.tasima &&
                  Object.entries(tipBazliIrsaliye.tasima).map(([musteriAdi, kayitlar], index) => ({
                    key: index.toString(),
                    label: (
                      <Flex align="center">
                        <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                        <CountBadge>{kayitlar.length}</CountBadge>
                      </Flex>
                    ),
                    children: (
                      <IrsaliyeTablo
                        data={kayitlar}
                        columns={columns}
                        deleteRecordsFunc={secilenKaydiSil}
                      />
                    ),

                    style: collapseStyle.subCollapseItem,

                    extra: <LogoyaGonderButon kayitlar={kayitlar} />,
                  }))
                }
              />
            ),
          },
        ]}
      />
    </div>
  );
}

function IrsaliyeTablo({ data, columns, deleteRecordsFunc }) {
  return (
    <TableGod
      dataSource={data}
      columns={columns}
      pagination={false}
      contextMenu={{
        deleteAction: deleteRecordsFunc,
      }}
    />
  );
}

function LogoyaGonderButon({ kayitlar }) {
  const { soforler, plakalar, irsaliyeler, setIrsaliyeler, setDevamEdenUretimler, referanslar } =
    useDBContext();
  const { showNotification } = useUIContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [butonLoading, setButonLoading] = useState(false);

  const [secilenSofor, setSecilenSofor] = useState({});

  const showModal = (e) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  const logoIrsaliyeObjesiOlustur = (genelAciklama, irsaliyeKaydi) => {
    const firmaAdi = irsaliyeKaydi[0].fasona
      ? irsaliyeKaydi[0].Referanslar.fasonFirmasi
      : irsaliyeKaydi[0].Referanslar.musteriAdi;

    console.log("firmaAdi", firmaAdi);

    const firmaRef = irsaliyeKaydi[0].fasona
      ? irsaliyeKaydi[0].Referanslar.fasonFirmaRef
      : irsaliyeKaydi[0].Referanslar.musteriRef;

    console.log("firmaRef", firmaRef);

    const irsaliyeTipi = irsaliyeKaydi[0].tip;
    const fason = irsaliyeKaydi[0].fasona;

    let gonderilecekGenelAciklama = "";

    if (irsaliyeTipi === "tasima") {
      // tipi tasima ise iadedir veya fasondur
      if (fason) {
        gonderilecekGenelAciklama = "FASON İŞLEM İÇİN GÖNDERİLİYOR.FATURA EDİLMEYECEK";
      } else {
        gonderilecekGenelAciklama = "TEKRAR İŞLEM YAPILMIŞTIR. FATURA EDİLMEYECEK";
      }
    }

    // console.log("genelAciklama", genelAciklama);
    // console.log("gonderilecekGenelAciklama", gonderilecekGenelAciklama);
    // console.log("irsaliyeKaydi", irsaliyeKaydi);

    const irsaliyeMaster = {
      genelAciklama1: gonderilecekGenelAciklama,
      genelAciklama2: genelAciklama,
      logicalref: 0,
      turu: 8, // 1: alış , 8: satış irsaliyesi
      tarih: getCurrentTimeWithLogoFormat(),
      cariRef: firmaRef,
      cariHesapKoduUnvani: firmaAdi,
      plaka: irsaliyeKaydi[0].plaka,
      soforAdi: secilenSofor.adi,
      soforSoyadi: secilenSofor.soyadi,
      soforKimlikNo: secilenSofor.kimlikNo,
    };

    const irsaliyeDetails = irsaliyeKaydi.map((kayit, index) => ({
      logicalref: 0,
      irsaliyeRef: 0,
      satirNo: index + 1,
      malzemeRef: referanslar.find((r) => r.referansNo === kayit.referansNo).logoMalzemeRef, // 153700290005 ÇANAK YAY FOSFAT
      miktar: kayit.uretimAdedi,
      birimRef: referanslar.find((r) => r.referansNo === kayit.referansNo).logoAnaBirimRef, // 153700290005 ÇANAK YAY FOSFAT
      satirAciklamasi: referanslar.find((r) => r.referansNo === kayit.referansNo)
        .irsaliyeAciklamasi,
    }));

    const logoIrsaliye = {
      irsaliyeMaster,
      irsaliyeDetails,
    };

    return logoIrsaliye;
  };

  // const handleOk = async (values) => {
  //   const gonderilecekKayitlar = kayitlar.map((kayit) => ({
  //     ...kayit,
  //     sofor: secilenSofor,
  //     plaka: values.plaka,
  //     sevkTarihi: getCurrentDateTime(),
  //     aciklama: values.genelAciklama,
  //   }));

  //   const { musteriAdi } = kayitlar[0].Referanslar;

  //   try {
  //     const logoIrsaliye = logoIrsaliyeObjesiOlustur(values.genelAciklama, gonderilecekKayitlar);

  //     await uretimGirisleriHttp.sevkiyatBilgileriniDoldur(
  //       gonderilecekKayitlar,
  //       "XXXXX", // logo irsaliye no
  //     );
  //     await tamamlananUretimHttp.addData(gonderilecekKayitlar);
  //     const devamEdenler = await devamEdenUretimHttp.getData();
  //     const newIrsaliyeler = await irsaliyeHttp.listeyiTemizle(irsaliyeler, gonderilecekKayitlar);
  //     setIrsaliyeler(newIrsaliyeler);
  //     setDevamEdenUretimler(devamEdenler);
  //     setIsModalVisible(false);
  //     showNotification(
  //       "success",
  //       `${musteriAdi} müşterisine ait irsaliye kaydı logoya gönderildi.`,
  //     );
  //   } catch (err) {
  //     showNotification("error", err.message);
  //   }
  // };
  const handleOk = async (values) => {
    const gonderilecekKayitlar = kayitlar.map((kayit) => ({
      ...kayit,
      sofor: secilenSofor,
      plaka: values.plaka,
      sevkTarihi: getCurrentDateTime(),
      aciklama: values.genelAciklama,
    }));

    const { musteriAdi } = kayitlar[0].Referanslar;

    try {
      const logoIrsaliye = logoIrsaliyeObjesiOlustur(values.genelAciklama, gonderilecekKayitlar);
      setButonLoading(true);

      const logoResponse = await logoGoApi.postData("PostIrsaliye", logoIrsaliye);

      if (logoResponse.statusCode === 200) {
        await uretimGirisleriHttp.sevkiyatBilgileriniDoldur(
          gonderilecekKayitlar,
          logoResponse.message, // logo irsaliye no
        );
        await tamamlananUretimHttp.addData(gonderilecekKayitlar);
        const devamEdenler = await devamEdenUretimHttp.getData();
        const newIrsaliyeler = await irsaliyeHttp.listeyiTemizle(irsaliyeler, gonderilecekKayitlar);
        setIrsaliyeler(newIrsaliyeler);
        setDevamEdenUretimler(devamEdenler);
        setIsModalVisible(false);
        setButonLoading(false);
        showNotification(
          "success",
          `${musteriAdi} müşterisine ait irsaliye kaydı logoya gönderildi.`,
        );
      } else {
        showNotification("error", logoResponse.message);
      }
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  const soforSec = (value) => {
    const selectedSofor = soforler.find((sofor) => sofor.logicalref === value);
    setSecilenSofor(selectedSofor);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  return (
    <Button
      style={{
        background: "#b1e6bc",
        color: "#090909",
        fontWeight: "600",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
        marginBottom: "6px",
        padding: "10px 15px",
        border: "1px solid rgb(73, 171, 66)",
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      icon={
        <div style={{ display: "flex", alignItems: "center" }}>
          <CaretRightOutlined />
          <span style={{ marginLeft: 5 }}>Logoya Gönder</span>
        </div>
      }
      onClick={showModal}
      size="small"
    >
      <Modal
        title="Bilgileri Doldurun"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        destroyOnClose
        footer={null}
      >
        <Form
          labelCol={{ flex: "100px" }}
          labelAlign="left"
          onFinish={handleOk}
          style={{ marginTop: "20px" }}
        >
          <Form.Item
            label="Şoför"
            name="soforAdi"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Select
              placeholder="Şoför seçiniz"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={soforSec}
            >
              {[...soforler]
                .sort((a, b) => a.adi.localeCompare(b.adi))
                .map((sofor) => (
                  <Select.Option key={sofor.logicalref} value={sofor.logicalref}>
                    {`${sofor.adi} ${sofor.soyadi}`}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Plaka"
            name="plaka"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Select placeholder="Plaka seçiniz" showSearch>
              {plakalar.map((plaka) => (
                <Select.Option key={plaka.logicalref} value={plaka.plaka}>
                  {plaka.plaka}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Açıklama" name="genelAciklama">
            <Input placeholder="Açıklama girin" />
          </Form.Item>

          <Divider />

          <Button
            htmlType="submit"
            block
            style={{
              background: "linear-gradient(135deg, #b1e6bc 58%, #88df99 100%)",
              color: "#090909",
              fontWeight: "bold",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1.4vmin",
              padding: "10px 15px",
              border: "1px solid rgb(73, 171, 66)",
              height: 35,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            loading={butonLoading}
            icon={
              <div style={{ display: "flex", alignItems: "center" }}>
                <CaretRightOutlined />
                <span style={{ marginLeft: 5 }}>Logoya Gönder ({kayitlar.length} adet)</span>
              </div>
            }
          />
        </Form>
      </Modal>
    </Button>
  );
}
