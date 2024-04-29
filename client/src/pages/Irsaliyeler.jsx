import { CaretRightOutlined, CloudUploadOutlined, DeleteOutlined } from "@ant-design/icons";
import { Badge, Button, Collapse, Modal, Tag, Input, Select, Flex } from "antd";
import PageHeader from "components/shared/PageHeader";
import TableGod from "components/shared/TableGod";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import { FcRules } from "react-icons/fc";
import irsaliyeHttp from "services/irsaliyeler.http";
import uretimGirisleriHttp from "services/uretim-girisleri.http";
import { devamEdenUretimHttp } from "services/uretimler.http";
import { getCurrentDateTime } from "utils/time.helper";

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
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        render: (text) => (
          <Tag color="blue" style={{ fontSize: "14px" }}>
            {text}
          </Tag>
        ),
        // width: 120,
      },
      {
        title: "İade",
        dataIndex: "iade",
        key: "iade",
        // width: 100,
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
              <Flex justify="center">
                <Badge
                  count={sevkIrsaliyeleri.length}
                  offset={[20, 6]}
                  title="Toplam sevk irsaliyesi sayısı"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#474747",
                    }}
                  >
                    Sevk İrsaliyesi
                  </div>
                </Badge>
              </Flex>
            ),
            style: {
              borderRadius: 10,
              marginBottom: 6,
              background: "rgba(76, 144, 85, 0.072)",
              // background: "rgba(229, 33, 46, 0.061)",
              // background: "rgba(255, 255, 255, 0.5)",
            },
            children: (
              <Collapse
                bordered={false}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                defaultActiveKey={Object.keys(tipBazliIrsaliye).map((_, index) => index.toString())}
                items={
                  tipBazliIrsaliye.sevk &&
                  Object.entries(tipBazliIrsaliye.sevk).map(([musteriAdi, kayitlar], index) => ({
                    key: index.toString(),
                    label: (
                      <Badge
                        count={new Set(kayitlar?.map((item) => item.referansNo)).size}
                        offset={[50, 7]}
                        color="cyan"
                        title="Farklı referans sayısı"
                      >
                        <Badge count={kayitlar.length} offset={[20, 6]} title="Kayıt sayısı">
                          <div
                            style={{
                              // fontSize: "16px",
                              fontWeight: "600",
                              color: "#474747",
                            }}
                          >
                            {musteriAdi}
                          </div>
                        </Badge>
                      </Badge>
                    ),
                    children: (
                      <IrsaliyeTablo
                        data={kayitlar}
                        columns={columns}
                        deleteRecordsFunc={secilenKaydiSil}
                      />
                    ),
                    style: {
                      borderRadius: 10,
                      marginTop: 6,
                      // background: "red",
                      background: "rgba(255, 255, 255, 0.4)",
                    },
                    extra: <LogoyaGonderButton type="sevk" kayitlar={kayitlar} />,
                  }))
                }
              />
            ),
          },
          {
            key: "tasima",
            label: (
              <Flex justify="center">
                <Badge
                  count={tasimaIrsaliyeleri.length}
                  offset={[20, 6]}
                  color="purple"
                  title="Toplam taşıma irsaliyesi sayısı"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#474747",
                    }}
                  >
                    Taşıma İrsaliyesi
                  </div>
                </Badge>
              </Flex>
            ),
            style: {
              borderRadius: 10,
              marginBottom: 6,
              background: "rgba(161, 46, 134, 0.061)",
              // background: "rgba(161, 46, 134, 0.1)",
              // background: "rgba(255, 255, 255, 0.5)",
            },
            children: (
              <Collapse
                bordered={false}
                defaultActiveKey={Object.keys(tipBazliIrsaliye).map((_, index) => index.toString())}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                items={
                  tipBazliIrsaliye.tasima &&
                  Object.entries(tipBazliIrsaliye.tasima).map(([musteriAdi, kayitlar], index) => ({
                    key: index.toString(),
                    label: (
                      <Badge
                        count={new Set(kayitlar?.map((item) => item.referansNo)).size}
                        offset={[50, 7]}
                        color="cyan"
                        title="Farklı referans sayısı"
                      >
                        <Badge
                          count={kayitlar.length}
                          offset={[20, 6]}
                          color="purple"
                          title="Kayıt sayısı"
                        >
                          <div
                            style={{
                              // fontSize: "16px",
                              fontWeight: "600",
                              color: "#474747",
                            }}
                          >
                            {musteriAdi}
                          </div>
                        </Badge>
                      </Badge>
                    ),
                    children: (
                      <IrsaliyeTablo
                        data={kayitlar}
                        columns={columns}
                        deleteRecordsFunc={secilenKaydiSil}
                      />
                    ),
                    style: {
                      borderRadius: 10,
                      marginTop: 6,
                      // background: "red",
                      background: "rgba(255, 255, 255, 0.4)",
                    },
                    extra: <LogoyaGonderButton type="tasima" kayitlar={kayitlar} />,
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

function LogoyaGonderButton({ type, kayitlar }) {
  const { personeller, irsaliyeler, setIrsaliyeler, setDevamEdenUretimler } = useDBContext();
  const { showNotification } = useUIContext();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [soforAdi, setSoforAdi] = useState("");
  const [personelAdi, setPersonelAdi] = useState("");
  const [error, setError] = useState("");

  const showModal = (e) => {
    e.stopPropagation();

    setIsModalVisible(true);
  };

  const handleOk = async (e) => {
    e.stopPropagation();

    if (soforAdi === "") {
      setError("Şöför adı boş olamaz");
    } else {
      // console.log("Kayıtlar:", kayitlar);
      const gonderilecekKayitlar = kayitlar.map((kayit) => ({
        ...kayit,
        sofor: soforAdi,
        personel: personelAdi,
        irsaliyeNo: "14-ABCDE",
        sevkTarihi: getCurrentDateTime(),
      }));
      console.log("Kayıtlar:", gonderilecekKayitlar);
      try {
        await uretimGirisleriHttp.sevkEt(gonderilecekKayitlar);
        const newIrsaliyeler = await irsaliyeHttp.deleteData(irsaliyeler, gonderilecekKayitlar);
        await uretimGirisleriHttp.deleteData(gonderilecekKayitlar);
        const devamEdenler = await devamEdenUretimHttp.getData();

        setIrsaliyeler(newIrsaliyeler);
        setDevamEdenUretimler(devamEdenler);
        setIsModalVisible(false);
        const { musteriAdi } = kayitlar[0].Referanslar;
        showNotification("success", `${musteriAdi} müşterisine irsaliye kesildi.`);
      } catch (err) {
        showNotification("error", err.message);
      }
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  const handleChange = (e) => {
    e.stopPropagation();
    setError("");
    setSoforAdi(e.target.value);
  };

  const handleSelectChange = (value, e) => {
    console.log("e", e);

    setPersonelAdi(value);
  };
  return (
    <>
      <Button
        style={{ marginRight: "4px" }}
        type="primary"
        danger={type === "sevk"}
        icon={<CloudUploadOutlined />}
        onClick={showModal}
      >
        Logoya Gönder
      </Button>
      <Modal
        title="Bilgileri Doldurun"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        // maskClosable={false}
        destroyOnClose
      >
        <Input
          value={soforAdi}
          onChange={handleChange}
          placeholder="Şoför adı giriniz"
          onClick={(e) => e.stopPropagation()}
        />
        <div style={{ marginLeft: "6px", marginTop: "4px", color: "red" }}>{error}</div>
        <Select
          placeholder="Personel seçiniz"
          style={{ width: "100%", marginTop: "8px" }}
          onChange={handleSelectChange}
        >
          {personeller.map((personel) => (
            <Select.Option key={personel.id} value={`${personel.ad} ${personel.soyad}`}>
              {`${personel.ad} ${personel.soyad}`}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}
