import { CaretRightOutlined } from "@ant-design/icons";
import { Badge, Button, Collapse, Divider, Flex, Form, Input, Modal, Select } from "antd";
import ColumnBadge from "components/shared/ColumnBadge";
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
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
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
        dataIndex: "uretimSiraNo",
        key: "uretimSiraNo",
        render: (text) => <IdBadge value={text} />,
        width: 70,
      },
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        render: (text) => <ColumnBadge color="#fb8500" value={text} />,
      },
      {
        title: "İade",
        dataIndex: "iade",
        key: "iade",
      },
      {
        title: "Sipariş No",
        dataIndex: "siparisNo",
        key: "siparisNo",
        // width: 100,
      },
      {
        title: "Talep No",
        dataIndex: "talepNo",
        key: "talepNo",
        // width: 100,
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
                <Badge
                  count={sevkIrsaliyeleri.length}
                  offset={[20, 9]}
                  title="Toplam sevk irsaliyesi sayısı"
                >
                  <div style={collapseStyle.parentCollapseHeader}>Sevk İrsaliyeleri</div>
                </Badge>
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
                      <Badge count={kayitlar.length} offset={[20, 5]} title="Kayıt sayısı">
                        <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                      </Badge>
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
                <Badge
                  count={tasimaIrsaliyeleri.length}
                  offset={[20, 9]}
                  color="purple"
                  title="Toplam taşıma irsaliyesi sayısı"
                >
                  <div style={collapseStyle.parentCollapseHeader}>Taşıma İrsaliyeleri</div>
                </Badge>
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
                      <Badge
                        count={kayitlar.length}
                        offset={[20, 5]}
                        color="purple"
                        title="Kayıt sayısı"
                      >
                        <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                      </Badge>
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
  const { soforler, plakalar, irsaliyeler, setIrsaliyeler, setDevamEdenUretimler, musteriler } =
    useDBContext();
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

    const musteri = musteriler.find((m) => m.adi === firmaAdi);

    const irsaliyeTipi = irsaliyeKaydi[0].tip;

    const gonderilecekGenelAciklama =
      irsaliyeTipi === "tasima"
        ? `FASON İŞLEM İÇİN GÖNDERİLİYOR.FATURA EDİLMEYECEKTİR.\r\n${genelAciklama}`
        : genelAciklama;

    const irsaliyeMaster = {
      genelAciklama: gonderilecekGenelAciklama,
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

    // ! burası gerçek referanslar ile doldurulacak
    const irsaliyeDetails = irsaliyeKaydi.map((kayit, index) => ({
      logicalref: 0,
      irsaliyeRef: 0,
      satirNo: index + 1,
      malzemeRef: 4792, // 153700290005 ÇANAK YAY FOSFAT
      miktar: kayit.uretimAdedi,
      birimRef: 5, // 153700290005 ÇANAK YAY FOSFAT
      satirAciklamasi: "**AKIN TARAFINDAN GÖNDERİLMİŞ DENEME KAYDI - GEÇERSİZ VE SİLİNECEK**",
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
      console.log("logoIrsaliye", logoIrsaliye);

      const logoResponse = await logoGoApi.postData("PostIrsaliye", logoIrsaliye);
      console.log("PostIrsaliyeResponse", logoResponse);

      showNotification(
        "success",
        `${musteriAdi} müşterisine ait irsaliye kaydı logoya gönderildi.`,
      );

      // await uretimGirisleriHttp.sevkiyatBilgileriniDoldur(gonderilecekKayitlar);
      // const devamEdenler = await devamEdenUretimHttp.getData();
      // const newIrsaliyeler = await irsaliyeHttp.listeyiTemizle(irsaliyeler, gonderilecekKayitlar);
      // setIrsaliyeler(newIrsaliyeler);
      // setDevamEdenUretimler(devamEdenler);
      // setIsModalVisible(false);
      // showNotification(
      //   "success",
      //   `${musteriAdi} müşterisine ait irsaliye kaydı logoya gönderildi.`,
      // );
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  const soforSec = (value) => {
    const selectedSofor = soforler.find((sofor) => sofor.id === value);
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
        alignContent: "center",
        background: "#f7ebed",
        color: "#555555",
      }}
      danger
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
                <Select.Option key={sofor.id} value={sofor.id}>
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
                <Select.Option key={plaka.id} value={plaka.plaka}>
                  {plaka.plaka}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Açıklama"
            name="genelAciklama"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input placeholder="Açıklama girin" />
          </Form.Item>

          <Divider />

          <Button
            htmlType="submit"
            block
            danger
            icon={
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={LogoIcon} width={40} />
                <div>'ya Gönder</div>
              </div>
            }
            style={{ background: "#f5e3e6", color: "#555555" }}
          />
        </Form>
      </Modal>
    </Button>
  );
}
