import { CaretRightOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Badge, Button, Collapse, Divider, Flex, Form, Modal, Select, Tag } from "antd";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
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
        render: (text) => (
          <Tag color="orange" style={{ fontSize: "14px" }}>
            {text}
          </Tag>
        ),
        // width: 120,
      },
      {
        title: "İade",
        dataIndex: "iade",
        key: "iade",
        render: (text) =>
          text === "Evet" ? <Tag color="green">{text}</Tag> : <Tag color="red">{text}</Tag>,
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
            style: collapseStyle.parentCollapseItem,
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
                    style: collapseStyle.subCollapseItem,

                    extra: <IrsaliyeKesButon type="sevk" kayitlar={kayitlar} />,
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

            style: collapseStyle.parentCollapseItem,

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

                    style: collapseStyle.subCollapseItem,

                    extra: <IrsaliyeKesButon type="tasima" kayitlar={kayitlar} />,
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

function IrsaliyeKesButon({ type, kayitlar }) {
  const { personeller, soforler, plakalar, irsaliyeler, setIrsaliyeler, setDevamEdenUretimler } =
    useDBContext();
  const { showNotification } = useUIContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (e) => {
    e.stopPropagation();
    setIsModalVisible(true);
  };

  const handleOk = async (values) => {
    const gonderilecekKayitlar = kayitlar.map((kayit) => ({
      ...kayit,
      sofor: values.soforAdi,
      plaka: values.plaka,
      personel: values.personelAdi,
      irsaliyeNo: "14-ABCDE",
      sevkTarihi: getCurrentDateTime(),
    }));
    console.log("Kayıtlar:", gonderilecekKayitlar);
    try {
      await uretimGirisleriHttp.sevkEt(gonderilecekKayitlar);
      const newIrsaliyeler = await irsaliyeHttp.deleteData(irsaliyeler, gonderilecekKayitlar);
      const devamEdenler = await devamEdenUretimHttp.getData();
      setIrsaliyeler(newIrsaliyeler);
      setDevamEdenUretimler(devamEdenler);
      setIsModalVisible(false);
      const { musteriAdi } = kayitlar[0].Referanslar;
      showNotification("success", `${musteriAdi} müşterisine irsaliye kesildi.`);
    } catch (err) {
      showNotification("error", err.message);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsModalVisible(false);
  };

  return (
    <Button
      style={{ marginRight: "4px", background: "#08bf8e", color: "white" }}
      type="primary"
      danger={type === "sevk"}
      icon={<CloudUploadOutlined />}
      onClick={showModal}
    >
      e-İrsaliye Kes
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
            label="Personel"
            name="personelAdi"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Select placeholder="Personel seçiniz">
              {personeller.map((personel) => (
                <Select.Option key={personel.id} value={`${personel.ad} ${personel.soyad}`}>
                  {`${personel.ad} ${personel.soyad}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
            <Select placeholder="Şoför seçiniz">
              {soforler.map((sofor) => (
                <Select.Option key={sofor.id} value={`${sofor.ad} ${sofor.soyad}`}>
                  {`${sofor.ad} ${sofor.soyad}`}
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
            <Select placeholder="Plaka seçiniz">
              {plakalar.map((plaka) => (
                <Select.Option key={plaka.id} value={plaka.plaka}>
                  {plaka.plaka}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          <Button
            type="primary"
            htmlType="submit"
            block
            icon={<CloudUploadOutlined />}
            style={{ background: "#08bf8e", color: "white" }}
          >
            e-İrsaliye Kes
          </Button>
        </Form>
      </Modal>
    </Button>
  );
}
