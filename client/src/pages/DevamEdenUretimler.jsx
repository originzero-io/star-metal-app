import { CaretRightOutlined, ContainerOutlined, DeleteOutlined } from "@ant-design/icons";
import { FcSynchronize } from "react-icons/fc";

import { Badge, Button, Collapse, Modal, Tag } from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import MalzemeDuzenlemeForm from "components/forms/MalzemeDuzenlemeForm";
import UretimGirisi from "components/forms/UretimGirisi";
import PageHeader from "components/shared/PageHeader";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import { devamEdenUretimHttp } from "services/uretimler.http";
import { fasonFirmasiKontrol, fasonaIrsaliyeKaydiOlustur } from "utils/irsaliye.helper";
import { createTableFilterFromData } from "utils/table.helper";
import irsaliyeHttp from "services/irsaliyeler.http";
import TableGod from "../components/shared/TableGod";
import SevkEdilecekler from "./SevkEdilecekler";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const collapseItemStyle = {
  borderRadius: 10,
  marginBottom: 6,
  background: "rgba(255, 255, 255, 0.5)",
};

const subCollapseItemStyle = {
  borderRadius: 10,
  marginTop: 4,
  background: "rgba(255, 255, 255, 0.4)",
};

function DevamEdenUretimler() {
  const { devamEdenUretimler } = useDBContext();

  const deleteRecordHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili kayıtları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        console.log("Evet, eminim");
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };

  return (
    <div>
      <PageHeader label="Devam Eden Üretimler" icon={<FcSynchronize />} />

      <Collapse
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        bordered={false}
        defaultActiveKey={["normal", "fason"]}
        // style={{ userSelect: "none" }}
        items={[
          {
            key: "normal",
            style: collapseItemStyle,
            label: (
              <Badge count={devamEdenUretimler.normalUretimler?.length} offset={[20, 6]}>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#474747",
                  }}
                >
                  Star Metal Üretimler
                </div>
              </Badge>
            ),
            children: (
              <NormalUretimlerTablo
                data={devamEdenUretimler.normalUretimler || []}
                deleteRecordsFunc={deleteRecordHandler}
              />
            ),
          },
          {
            key: "fason",
            style: collapseItemStyle,
            label: (
              <Badge
                count={devamEdenUretimler.fasonUretimler?.length}
                offset={[20, 6]}
                color="blue"
              >
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#474747",
                  }}
                >
                  Fason Üretimler
                </div>
              </Badge>
            ),
            children: (
              <FasonUretimlerTablo
                data={devamEdenUretimler.fasonUretimler || []}
                deleteRecordsFunc={deleteRecordHandler}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

function NormalUretimlerTablo({ data, deleteRecordsFunc }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel } = useUIContext();

  const [musteriBazliKayitlar, setMusteriBazliKayitlar] = useState([]);

  const columns = useMemo(
    () => [
      {
        title: "Referans",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: createTableFilterFromData(data, "referansNo"),
        onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text) => (
          <Tag color="orange" style={{ fontSize: "14px" }}>
            {text}
          </Tag>
        ),
        width: 120,
      },
      {
        title: "Çıkış Referansı",
        dataIndex: "cikisReferansNo",
        key: "cikisReferansNo",
        filters: [...new Set(data?.map((item) => item.Referanslar?.cikisReferansNo))].map(
          (cikisReferansNo) => ({
            text: cikisReferansNo,
            value: cikisReferansNo,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.cikisReferansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text, record) => (
          <Tag color="orange" style={{ fontSize: "14px" }}>
            {record?.Referanslar?.cikisReferansNo}
          </Tag>
        ),
        width: 120,
      },
      {
        title: "İade",
        dataIndex: "iade",
        key: "iade",
        render: (text, record) =>
          text === "Evet" ? <Tag color="volcano">{text}</Tag> : <Tag color="purple">{text}</Tag>,
        filters: createTableFilterFromData(data, "iade"),
        onFilter: (value, record) => record.iade.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        render: (text, record) => record.Referanslar.siparisTipi,
        filters: [...new Set(data?.map((item) => item.Referanslar?.siparisTipi))].map(
          (siparisTipi) => ({
            text: siparisTipi,
            value: siparisTipi,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.siparisTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş No",
        dataIndex: "siparisNo",
        key: "siparisNo",
        render: (text, record) => record?.Referanslar?.siparisNo,
        filters: [...new Set(data?.map((item) => item.Referanslar?.siparisNo || "Boş"))].map(
          (siparisNo) => ({
            text: siparisNo,
            value: siparisNo,
          }),
        ),
        onFilter: (value, record) => {
          const siparisNo = record.Referanslar?.siparisNo || "Boş";
          return siparisNo.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Talep No",
        dataIndex: "talepNo",
        key: "talepNo",
        render: (text, record) => record.Referanslar?.talepNo,
        filters: [...new Set(data?.map((item) => item.Referanslar?.talepNo || "Boş"))].map(
          (talepNo) => ({
            text: talepNo,
            value: talepNo,
          }),
        ),
        onFilter: (value, record) => {
          const talepNo = record.Referanslar?.talepNo || "Boş";
          return talepNo.indexOf(value) === 0;
        },
      },
      {
        title: "İrsaliye No",
        dataIndex: "irsaliyeNo",
        key: "irsaliyeNo",
      },
      {
        title: "Gelen Tarih",
        dataIndex: "gelenTarih",
        key: "gelenTarih",
        width: 160,
      },
      {
        title: "Gelen",
        dataIndex: "gelenMiktar",
        key: "gelenMiktar",
        sorter: (a, b) => a.gelenMiktar - b.gelenMiktar,
      },
      {
        title: "Giden",
        dataIndex: "gidenMiktar",
        key: "gidenMiktar",
        sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      },
      {
        title: "Kalan",
        dataIndex: "kalanMiktar",
        key: "kalanMiktar",
        sorter: (a, b) => a.kalanMiktar - b.kalanMiktar,
      },
      {
        title: "Üretilen",
        dataIndex: "uretilenMiktar",
        key: "uretilenMiktar",
        sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      },
      {
        title: "Üretilmeyen",
        dataIndex: "uretilmeyenMiktar",
        key: "uretilmeyenMiktar",
        sorter: (a, b) => a.uretilmeyenMiktar - b.uretilmeyenMiktar,
      },
      {
        title: "Referans Yüzey Alanı",
        // dataIndex: ["Referanslar", "referansYuzeyAlani"],
        key: "referansYuzeyAlanı",
        render: (text, record) => record.Referanslar?.referansYuzeyAlani,
      },
      {
        title: "İşlem Tipi",
        // dataIndex: "referansTipi",
        render: (text, record) => record.Referanslar?.islemTipi,
        key: "islemTipi",
        filters: [...new Set(data?.map((item) => item.Referanslar?.islemTipi))].map(
          (islemTipi) => ({
            text: islemTipi,
            value: islemTipi,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.islemTipi.indexOf(value) === 0,
        filterSearch: true,
      },
    ],
    [data],
  );

  useEffect(() => {
    const musteriBazli = data.reduce((acc, uretim) => {
      const { musteriAdi } = uretim.Referanslar;

      // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc; // Akümülatörü (gruplama objesini) döndür
    }, {}); // İlk değer olarak boş bir obje kullanılır
    setMusteriBazliKayitlar(musteriBazli);
  }, [data]);

  const createRowSelection = (musteriAdi) => ({
    type: "checkbox",
    onChange: (_selectedRowKeys, _selectedRows) => {
      setSelectedRows({ ...selectedRows, [musteriAdi]: _selectedRows });
    },
  });

  return (
    <Collapse
      bordered={false}
      items={Object.entries(musteriBazliKayitlar).map(([musteriAdi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <Badge count={kayitlar.length} offset={[20, 6]}>
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
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={columns}
            onChange={onChange}
            rowSelection={createRowSelection(musteriAdi)}
            contextMenu={{
              // editForm: MalzemeDuzenlemeForm,
              extraItems: [
                {
                  title: "Gelen Malzeme Miktarını Değiştir",
                  // action: (record) => window.electron.send("openNewWindow"),
                  // action: (record) =>
                  //   showPanel({
                  //     title: "Üretim / Sevkiyat Hareketleri",
                  //     content: <SevkEdilecekler record={record} />,
                  //     width: 1000,
                  //   }),
                },
                {
                  title: "Üretim / Sevkiyat Hareketleri",
                  // action: (record) => window.electron.send("openNewWindow"),
                  action: (record) =>
                    showPanel({
                      title: "Üretim / Sevkiyat Hareketleri",
                      content: <SevkEdilecekler record={record} />,
                      width: 1000,
                    }),
                },
                {
                  title: "Üretim İş Emri Kartı Çıkart",
                  action: (record) =>
                    showPanel({
                      title: "Üretim İş Emri Kartı",
                      content: <UretimIsEmriKarti record={record} />,
                      width: 800,
                    }),
                },
              ],
            }}
            actionButtons={
              <>
                {selectedRows[musteriAdi]?.length === 1 && (
                  <Button
                    style={{ marginRight: "4px" }}
                    type="primary"
                    icon={<ContainerOutlined />}
                    onClick={() =>
                      showPanel({
                        title: "Üretim Girişi",
                        content: <UretimGirisi record={selectedRows[musteriAdi][0]} />,
                        width: 800,
                      })
                    }
                  >
                    Üretim Girişi Yap
                  </Button>
                )}
                {selectedRows[musteriAdi]?.length > 0 && (
                  <>
                    <Button
                      style={{ marginRight: "4px" }}
                      danger
                      icon={<DeleteOutlined />}
                      onClick={deleteRecordsFunc}
                    >
                      Sil ({selectedRows[musteriAdi].length})
                    </Button>
                  </>
                )}
              </>
            }
          />
        ),
        style: subCollapseItemStyle,
      }))}
    />
  );
}

function FasonUretimlerTablo({ data, deleteRecordsFunc }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [secilmisIrsaliyeler, setSecilmisIrsaliyeler] = useState([]);
  const { irsaliyeler, setIrsaliyeler, setDevamEdenUretimler } = useDBContext();
  const { showPanel, showNotification, showAlert } = useUIContext();

  const [musteriBazliKayitlar, setMusteriBazliKayitlar] = useState([]);

  const columns = useMemo(
    () => [
      {
        title: "Fason Firması",
        dataIndex: "fasonFirmasi",
        key: "fasonFirmasi",
        render: (text, record) => (
          <Tag color="blue" style={{ fontSize: "14px" }}>
            {record.Referanslar?.fasonFirmasi}
          </Tag>
        ),
        filters: [...new Set(data?.map((item) => item.Referanslar?.fasonFirmasi))].map(
          (fasonFirmasi) => ({
            text: fasonFirmasi,
            value: fasonFirmasi,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.fasonFirmasi.indexOf(value) === 0,
        filterSearch: true,
        width: 120,
      },
      {
        title: "Referans",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: createTableFilterFromData(data, "referansNo"),
        onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text) => (
          <Tag color="orange" style={{ fontSize: "14px" }}>
            {text}
          </Tag>
        ),
        width: 120,
      },
      {
        title: "Çıkış Referansı",
        dataIndex: "cikisReferansNo",
        key: "cikisReferansNo",
        filters: [...new Set(data?.map((item) => item.Referanslar?.cikisReferansNo))].map(
          (cikisReferansNo) => ({
            text: cikisReferansNo,
            value: cikisReferansNo,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.cikisReferansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text, record) => (
          <Tag color="orange" style={{ fontSize: "14px" }}>
            {record.Referanslar.cikisReferansNo}
          </Tag>
        ),
        width: 120,
      },
      {
        title: "İade",
        dataIndex: "iade",
        key: "iade",
        render: (text, record) =>
          text === "Evet" ? <Tag color="volcano">{text}</Tag> : <Tag color="purple">{text}</Tag>,
        filters: createTableFilterFromData(data, "iade"),
        onFilter: (value, record) => record.iade.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        render: (text, record) => record.Referanslar.siparisTipi,
        filters: [...new Set(data?.map((item) => item.Referanslar?.siparisTipi))].map(
          (siparisTipi) => ({
            text: siparisTipi,
            value: siparisTipi,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.siparisTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş No",
        dataIndex: "siparisNo",
        key: "siparisNo",
        render: (text, record) => record.Referanslar?.siparisNo,
        filters: [...new Set(data?.map((item) => item.Referanslar?.siparisNo || "Boş"))].map(
          (siparisNo) => ({
            text: siparisNo,
            value: siparisNo,
          }),
        ),
        onFilter: (value, record) => {
          const siparisNo = record.Referanslar?.siparisNo || "Boş";
          return siparisNo.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Talep No",
        dataIndex: "talepNo",
        key: "talepNo",
        render: (text, record) => record.Referanslar?.talepNo,
        filters: [...new Set(data?.map((item) => item.Referanslar?.talepNo || "Boş"))].map(
          (talepNo) => ({
            text: talepNo,
            value: talepNo,
          }),
        ),
        onFilter: (value, record) => {
          const talepNo = record.Referanslar?.talepNo || "Boş";
          return talepNo.indexOf(value) === 0;
        },
      },
      {
        title: "İrsaliye No",
        dataIndex: "irsaliyeNo",
        key: "irsaliyeNo",
      },
      {
        title: "Gelen Tarih",
        dataIndex: "gelenTarih",
        key: "gelenTarih",
        width: 160,
      },
      {
        title: "Gelen",
        dataIndex: "gelenMiktar",
        key: "gelenMiktar",
        sorter: (a, b) => a.gelenMiktar - b.gelenMiktar,
        render: (text, record) =>
          record.gelenMiktar === record.gidenMiktar ? (
            <Tag color="green">{text}</Tag>
          ) : (
            <Tag>{text}</Tag>
          ),
      },
      {
        title: "Fasona Gönderilen",
        dataIndex: "gidenMiktar",
        key: "gidenMiktar",
        sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
        render: (text, record) =>
          record.gelenMiktar === record.gidenMiktar ? (
            <Tag color="green">{text}</Tag>
          ) : (
            <Tag>{text}</Tag>
          ),
      },
      {
        title: "Fasonda Üretilen",
        dataIndex: "uretilenMiktar",
        key: "uretilenMiktar",
        sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      },
      {
        title: "Sevk Edilen",
        dataIndex: "sevkEdilenMiktar",
        key: "sevkEdilenMiktar",
        sorter: (a, b) => a.sevkEdilenMiktar - b.sevkEdilenMiktar,
      },
      {
        title: "Referans Yüzey Alanı",
        // dataIndex: ["Referanslar", "referansYuzeyAlani"],
        key: "referansYuzeyAlanı",
        render: (text, record) => record.Referanslar?.referansYuzeyAlani,
      },
      {
        title: "İşlem Tipi",
        // dataIndex: "referansTipi",
        render: (text, record) => record.Referanslar?.islemTipi,
        key: "islemTipi",
        filters: [...new Set(data?.map((item) => item.Referanslar?.islemTipi))].map(
          (islemTipi) => ({
            text: islemTipi,
            value: islemTipi,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.islemTipi.indexOf(value) === 0,
        filterSearch: true,
      },
    ],
    [data],
  );

  useEffect(() => {
    const musteriBazli = data.reduce((acc, uretim) => {
      const { musteriAdi } = uretim.Referanslar;

      // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc; // Akümülatörü (gruplama objesini) döndür
    }, {}); // İlk değer olarak boş bir obje kullanılır
    setMusteriBazliKayitlar(musteriBazli);
  }, [data]);

  const createRowSelection = (musteriAdi) => ({
    type: "checkbox",
    onChange: (_selectedRowKeys, _selectedRows) => {
      console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
      const irsaliyesiKesilmemisOlanlar = _selectedRows.filter(
        (row) => row.gelenMiktar !== row.gidenMiktar,
      );
      setSelectedRows({ ...selectedRows, [musteriAdi]: _selectedRows });
      setSecilmisIrsaliyeler({ ...secilmisIrsaliyeler, [musteriAdi]: irsaliyesiKesilmemisOlanlar });
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.gelenMiktar === record.gidenMiktar, // Aktif olmayanlar için checkbox'ı devre dışı bırak
    // }),
  });

  const fasonaIrsaliyeKes = async (musteriAdi) => {
    const { fasonFirmasi: seciliFasonFirmasi } = selectedRows[musteriAdi][0].Referanslar;
    if (fasonFirmasiKontrol(selectedRows[musteriAdi])) {
      Modal.confirm({
        title: "Emin misiniz?",
        content: `Seçtiğiniz kayıtlar ${seciliFasonFirmasi} firmasına taşıma irsaliyesi kesmek için kaydedilecek. Onaylıyor musunuz?`,
        okText: "Tamam",
        cancelText: "İptal",
        async onOk() {
          try {
            const limit = 5;

            const irsaliyeKaydi = fasonaIrsaliyeKaydiOlustur(secilmisIrsaliyeler[musteriAdi]);

            console.log("irsaliye kaydı: ", irsaliyeKaydi);

            const { fasonFirmasi } = irsaliyeKaydi[0].Referanslar;

            const fasonFirmasindakiMevcutIrsaliyeler = irsaliyeler.filter(
              (irsaliye) => irsaliye.Referanslar.fasonFirmasi === fasonFirmasi,
            );

            const firmadaOlacakToplamIrsaliyeler = [
              ...fasonFirmasindakiMevcutIrsaliyeler,
              ...irsaliyeKaydi,
            ];

            const refBazliFirmaToplamIrsaliyeSayisi = new Set(
              firmadaOlacakToplamIrsaliyeler.map((item) => item.referansNo),
            ).size;

            if (refBazliFirmaToplamIrsaliyeSayisi <= limit) {
              const butunIrsaliyeler = await irsaliyeHttp.fasonlaraIrsaliyeKes(irsaliyeKaydi);
              const devamEdenUretimler = await devamEdenUretimHttp.getData();

              showNotification(
                "success",
                `Seçtiğiniz kayıtlar fason firmasına taşıma irsaliyesi kesmek için kaydedildi.`,
              );
              setDevamEdenUretimler(devamEdenUretimler);

              setIrsaliyeler(butunIrsaliyeler);
            } else {
              showAlert(
                "error",
                `İrsaliye kesilemedi. Bu referansları da eklediğinizde, ${fasonFirmasi} firmasına irsaliye kesilecek toplam referans sayısı ${refBazliFirmaToplamIrsaliyeSayisi} olacak. Bir firmaya en fazla ${limit} adet farklı referans gönderilebilir. Önce firmaya mevcut irsaliyeyi kesin ve sonra tekrar deneyin.`,
              );
            }
          } catch (error) {
            showNotification("error", error.message);
          }
        },
        onCancel() {
          showNotification("warning", "İşlem iptal edildi");
        },
      });
    } else {
      showAlert(
        "warning",
        "Fason firması farklı olan kayıtlar seçtiniz. Lütfen aynı firmaya ait kayıtları seçip tekrar deneyin.",
      );
    }
  };

  return (
    <Collapse
      bordered={false}
      items={Object.entries(musteriBazliKayitlar).map(([musteriAdi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <Badge count={kayitlar.length} offset={[20, 6]} color="blue">
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
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={columns}
            onChange={onChange}
            rowSelection={createRowSelection(musteriAdi)}
            contextMenu={{
              editForm: MalzemeDuzenlemeForm,
              extraItems: [
                {
                  title: "Gelen Malzeme Miktarını Değiştir",
                  // action: (record) => window.electron.send("openNewWindow"),
                  action: (record) =>
                    showPanel({
                      title: "Üretim / Sevkiyat Hareketleri",
                      content: <SevkEdilecekler record={record} />,
                      width: 1000,
                    }),
                },
                {
                  title: "Üretim / Sevkiyat Hareketleri",
                  // action: (record) => window.electron.send("openNewWindow"),
                  action: (record) =>
                    showPanel({
                      title: "Üretim / Sevkiyat Hareketleri",
                      content: <SevkEdilecekler record={record} />,
                      width: 1000,
                    }),
                },
                {
                  title: "Üretim İş Emri Kartı Çıkart",
                  action: (record) =>
                    showPanel({
                      title: "Üretim İş Emri Kartı",
                      content: <UretimIsEmriKarti record={record} />,
                      width: 800,
                    }),
                },
              ],
            }}
            actionButtons={
              <>
                {secilmisIrsaliyeler[musteriAdi]?.length > 0 && (
                  <Button
                    style={{ marginRight: "4px" }}
                    type="primary"
                    icon={<ContainerOutlined />}
                    onClick={() => fasonaIrsaliyeKes(musteriAdi)}
                  >
                    Fasona İrsaliye Kes
                    <Badge count={secilmisIrsaliyeler[musteriAdi].length} offset={[5, -4]} />
                  </Button>
                )}
                {selectedRows[musteriAdi]?.length === 1 && (
                  <>
                    <Button
                      style={{ marginRight: "4px" }}
                      type="primary"
                      icon={<ContainerOutlined />}
                      onClick={() =>
                        showPanel({
                          title: "Üretim Girişi",
                          content: <UretimGirisi record={selectedRows[musteriAdi][0]} />,
                          width: 800,
                        })
                      }
                    >
                      Fason Üretim Girişi Yap
                    </Button>
                  </>
                )}

                {selectedRows[musteriAdi]?.length > 0 && (
                  <>
                    <Button danger icon={<DeleteOutlined />} onClick={deleteRecordsFunc}>
                      Sil ({selectedRows[musteriAdi].length})
                    </Button>
                  </>
                )}
              </>
            }
          />
        ),
        style: subCollapseItemStyle,
      }))}
    />
  );
}

export default DevamEdenUretimler;
