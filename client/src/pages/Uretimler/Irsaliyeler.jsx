import { CaretRightOutlined, FileDoneOutlined } from "@ant-design/icons";
import { Badge, Button, Collapse, Divider, Flex, Form, Input, Modal, Select, Tag } from "antd";
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
import LogoIcon from "../../../public/logo.png";

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
        title: "Sıra No",
        dataIndex: "uretimId",
        key: "uretimId",
        render: (text) => <IdBadge value={text} />,
        width: 70,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        render: (text, record) => (
          <ColumnBadge
            color={record.Referanslar.siparisTipi === "SERİ" ? "volcano" : "purple"}
            value={record.Referanslar.siparisTipi}
          />
        ),
        width: 100,
      },
      {
        title: "Kodu",
        dataIndex: "kodu",
        key: "kodu",
        render: (text, record) => (
          <ColumnBadge
            color={record.Referanslar.siparisTipi === "SERİ" ? "volcano" : "purple"}
            value={record.Referanslar.kodu}
          />
        ),
        width: 170,
      },
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        render: (text) => <ColumnBadge color="orange" value={text} />,
        width: 160,
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
        // width: 100,
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
      <PageHeader label="İrsaliye Sayfası" icon={<FcRules />} />
      <Collapse
        bordered={false}
        defaultActiveKey={["sevk", "tasima"]}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        items={[
          {
            key: "sevk",
            label: (
              <Flex>
                <CountBadge
                  count={sevkIrsaliyeleri.length}
                  offset={[20, 9]}
                  title="Toplam sevk irsaliyesi sayısı"
                >
                  <div style={collapseStyle.parentCollapseHeader}>Sevk İrsaliyeleri</div>
                </CountBadge>
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
                      <CountBadge count={kayitlar.length} offset={[20, 5]} title="Kayıt sayısı">
                        <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                      </CountBadge>
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
              <Flex>
                <CountBadge
                  count={tasimaIrsaliyeleri.length}
                  offset={[20, 7]}
                  title="Toplam taşıma irsaliyesi sayısı"
                >
                  <div style={collapseStyle.parentCollapseHeader}>Fason & İade İrsaliyeleri</div>
                </CountBadge>
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
                      <CountBadge count={kayitlar.length} offset={[20, 5]} title="Kayıt sayısı">
                        <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                      </CountBadge>
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
      hideDefaultTitleButtons
      pagination={false}
      contextMenu={{
        deleteAction: deleteRecordsFunc,
      }}
    />
  );
}

function LogoyaGonderButon({ kayitlar }) {
  const {
    soforler,
    plakalar,
    irsaliyeler,
    setIrsaliyeler,
    setDevamEdenUretimler,
    referanslar,
    musteriler,
  } = useDBContext();
  const { showNotification } = useUIContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [secilenSofor, setSecilenSofor] = useState({});

  const showModal = (e) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  const logoIrsaliyeObjesiOlustur = (genelAciklama, irsaliyeKaydi) => {
    const firmaAdi = irsaliyeKaydi[0].Referanslar.fasonFirmasi
      ? irsaliyeKaydi[0].Referanslar.fasonFirmasi
      : irsaliyeKaydi[0].Referanslar.musteriAdi;

    const musteri = musteriler.find((m) => m.unvani === firmaAdi);

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

    console.log("genelAciklama", genelAciklama);
    console.log("gonderilecekGenelAciklama", gonderilecekGenelAciklama);
    console.log("irsaliyeKaydi", irsaliyeKaydi);

    const irsaliyeMaster = {
      genelAciklama1: gonderilecekGenelAciklama,
      genelAciklama2: genelAciklama,
      logicalref: 0,
      turu: 8, // 1: alış , 8: satış irsaliyesi
      tarih: getCurrentTimeWithLogoFormat(),
      cariRef: musteri.logoRef,
      cariHesapKoduUnvani: irsaliyeKaydi[0].Referanslar.fasonFirmasi
        ? irsaliyeKaydi[0].Referanslar.fasonFirmasi
        : irsaliyeKaydi[0].Referanslar.musteriAdi,
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

  const handleOk = async (values) => {
    const gonderilecekKayitlar = kayitlar.map((kayit) => ({
      ...kayit,
      sofor: secilenSofor,
      plaka: values.plaka,
      irsaliyeNo: "14-ABCDE",
      sevkTarihi: getCurrentDateTime(),
    }));

    const { musteriAdi } = kayitlar[0].Referanslar;

    try {
      const logoIrsaliye = logoIrsaliyeObjesiOlustur(values.genelAciklama, gonderilecekKayitlar);

      const logoResponse = await logoGoApi.postData("PostIrsaliye", logoIrsaliye);

      if (logoResponse.statusCode === 200) {
        await uretimGirisleriHttp.sevkiyatBilgileriniDoldur(gonderilecekKayitlar);
        await tamamlananUretimHttp.addData(gonderilecekKayitlar);
        const devamEdenler = await devamEdenUretimHttp.getData();
        const newIrsaliyeler = await irsaliyeHttp.listeyiTemizle(irsaliyeler, gonderilecekKayitlar);
        setIrsaliyeler(newIrsaliyeler);
        setDevamEdenUretimler(devamEdenler);
        setIsModalVisible(false);
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
        marginRight: "4px",
        fontSize: "12px",
        justifyContent: "center",
        alignItems: "center",
        background: "#ddd9f4",
        color: "#484646",
        border: "1px solid #786cc9",
      }}
      icon={
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={LogoIcon} width={35} />
          <span>'ya Gönder</span>
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
            <Select placeholder="Şoför seçiniz" showSearch onChange={soforSec}>
              {soforler.map((sofor) => (
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
            icon={
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={LogoIcon} width={40} />
                <div>'ya Gönder</div>
              </div>
            }
            style={{ background: "#ddd9f4", color: "#484646", border: "1px solid #786cc9" }}
          />
        </Form>
      </Modal>
    </Button>
  );
}
