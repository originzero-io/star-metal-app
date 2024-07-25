import { CaretRightOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { Alert, Badge, Button, Collapse, Flex, Modal } from "antd";
import { FcInTransit } from "react-icons/fc";

import SevkiyatKarti from "components/cards/SevkiyatKarti";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import TableGod from "components/shared/TableGod";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import React, { useEffect, useMemo, useState } from "react";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import uretimGirisleriHttp from "services/crud-server/uretim-girisleri.http";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import { createTableFilterFromData } from "utils/table.helper";

const alertMessage = (musteri, irsaliyeTipi, olan, limit) => (
  <div>
    <span style={{ color: "green" }}>{musteri}</span> müşterisine
    <span style={{ color: "red" }}> {irsaliyeTipi} </span>
    kayıtları eklenemedi.
    <br></br>Bir müşteriye en fazla{" "}
    <span style={{ color: "red", fontSize: "20px" }} color="red">
      {limit}
    </span>{" "}
    adet farklı referans gönderilebilir. Bunlarla birlikte
    <span style={{ color: "red", fontSize: "20px" }} color="red">
      {" "}
      {olan}
    </span>{" "}
    olacak.
    <br></br>Önce mevcut {irsaliyeTipi}ni kesin ve sonra tekrar deneyin.
  </div>
);

export default function SevkEdilecekler() {
  const { user } = useAuth();

  const [uretimGirisleri, setUretimGirisleri] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { showModal, showNotification } = useUIContext();
  const { setLoading, loading, setDevamEdenUretimler } = useDBContext();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const uretimResponse = await uretimGirisleriHttp.getData();
      console.log("Müşteriye göre sevk edilmemiş üretim girişleri: ", uretimResponse);
      setUretimGirisleri(uretimResponse);
      setLoading(false);
    }

    fetchData();
  }, []);

  const createColumnsForCustomer = (musteriAdi) => [
    {
      title: "Sıra No",
      dataIndex: "uretimId",
      key: "uretimId",
      render: (text) => <IdBadge value={text} />,
      sorter: (a, b) => a.id - b.id,
      width: 70,
    },
    {
      title: "İrsaliye Tipi",
      dataIndex: "irsaliyeTipi",
      key: "irsaliyeTipi",
      render: (text, kayit) => {
        if (kayit.iade === "Hayır" || kayit?.Referanslar.kodu.toLowerCase().includes("YOK")) {
          return <ColumnBadge color="#e1f2fa" value="SEVK" />;
        }
        return <ColumnBadge color="#fcf2e9" value="TAŞIMA" />;
      },
      filters: [
        {
          text: "SEVK",
          value: "SEVK",
        },
        {
          text: "TAŞIMA",
          value: "TAŞIMA",
        },
      ],
      onFilter: (value, kayit) => {
        const irsaliyeTipi =
          kayit.iade === "Hayır" || kayit?.Referanslar.kodu.toLowerCase().includes("YOK")
            ? "SEVK"
            : "TAŞIMA";
        return irsaliyeTipi === value;
      },
      filterSearch: true,
      width: 100,
    },
    {
      title: "Sipariş Tipi",
      dataIndex: "siparisTipi",
      key: "siparisTipi",
      render: (text, record) => <ColumnBadge value={record.Referanslar.siparisTipi} />,
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
      filters: createTableFilterFromData(uretimGirisleri[musteriAdi], "referansNo"),
      onFilter: (value, _record) => _record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      width: 120,
    },
    {
      title: "İade",
      dataIndex: "iade",
      key: "iade",
      width: 60,
    },

    {
      title: "Fason Firması",
      dataIndex: "fasonFirmasi",
      key: "fasonFirmasi",
      render: (text, _record) =>
        _record.Referanslar.fasonFirmasi && (
          <ColumnBadge>{_record.Referanslar.fasonFirmasi}</ColumnBadge>
        ),
      filters: createTableFilterFromData(
        uretimGirisleri[musteriAdi].map((item) => item.Referanslar), // Eğer Referanslar her zaman varsa
        "fasonFirmasi",
      ),
      onFilter: (value, _record) => {
        const fasonFirmasi = _record.Referanslar.fasonFirmasi || "Boş";
        return fasonFirmasi.indexOf(value) === 0;
      },
      filterSearch: true,
      width: 120,
    },
    {
      title: "Üretim Tarihi",
      dataIndex: "uretimTarihi",
      key: "uretimTarihi",
      width: 160,
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
      width: 120,
    },
    {
      title: "2. Ambalaj",
      dataIndex: "ikinciAmbalaj",
      key: "ikinciAmbalaj",
      width: 120,
    },
    {
      title: "İşlem Tipi",
      dataIndex: "islemTipi",
      key: "islemTipi",
      render: (text, record) => <ColumnBadge value={record.Referanslar.islemTipi} />,
      filters: createTableFilterFromData(
        uretimGirisleri[musteriAdi].map((item) => item.Referanslar), // Eğer Referanslar her zaman varsa
        "islemTipi",
      ),
      onFilter: (value, record) => {
        const fasonFirmasi = record.Referanslar.islemTipi;
        return fasonFirmasi.indexOf(value) === 0;
      },
      filterSearch: true,
      width: 110,
    },
  ];

  const createRowSelection = (musteriAdi) => ({
    type: "checkbox",
    selectedRowKeys: selectedRowKeys[musteriAdi],
    onChange: (_selectedRowKeys, _selectedRows) => {
      setSelectedRows({ ...selectedRows, [musteriAdi]: _selectedRows });
      setSelectedRowKeys({ ...selectedRowKeys, [musteriAdi]: _selectedRowKeys });
    },
    getCheckboxProps: (_record) => ({
      disabled: !_record.aktif, // Aktif olmayanlar için checkbox'ı devre dışı bırak
      checked: false,
    }),
  });

  const deleteSelectedRecordsHandler = (musteriAdi) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili üretim girişlerini silmek üzeresiniz. Bu işlemi gerçekleştirdiğinizde devam eden üretimlerdeki üretim adetleri değişecek. Devam etmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const records = selectedRows[musteriAdi];
          await uretimGirisleriHttp.deleteData(records);
          const devamEdenUretimler = await devamEdenUretimHttp.getData();
          setDevamEdenUretimler(devamEdenUretimler);

          const uretimResponse = await uretimGirisleriHttp.getData();
          setUretimGirisleri(uretimResponse);
          showNotification(
            "success",
            `${records.length} adet üretim girişi silindi ve üretim adetleri güncellendi.`,
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
  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <PageHeader label="Sevk Edilecekler" icon={<FcInTransit />} />
      {Object.entries(uretimGirisleri).length > 0 ? (
        <Collapse
          // ghost
          bordered={false}
          size="small"
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          defaultActiveKey={Object.keys(uretimGirisleri).map((_, index) => index.toString())} // Tüm panelleri başlangıçta aç
          items={Object.entries(uretimGirisleri).map(([musteriAdi, kayitlar], index) => ({
            key: index.toString(),
            label: (
              <Flex>
                <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
                <CountBadge>{kayitlar.length}</CountBadge>
              </Flex>
            ),
            style: collapseStyle.subCollapseItem,
            children: (
              <TableGod
                dataSource={kayitlar}
                columns={createColumnsForCustomer(musteriAdi)}
                pagination={false}
                scroll={{ x: 1400 }}
                hideDefaultTitleButtons
                rowSelection={createRowSelection(musteriAdi)}
                // rowKey={kayitlar[index].id}
                rowStyle={(row) =>
                  !row.aktif && {
                    background: "rgba(81, 81, 81, 0.3)",
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }
                }
                actionButtons={
                  <>
                    {selectedRows[musteriAdi]?.length === 1 && (
                      <Button
                        type="primary"
                        style={{ marginRight: "4px" }}
                        icon={<PrinterOutlined />}
                        onClick={() =>
                          showModal({
                            title: "Sevkiyat Kartı",
                            content: React.createElement(SevkiyatKarti, {
                              record: selectedRows[musteriAdi][0],
                            }),
                            width: 1500,
                          })
                        }
                      >
                        Sevkiyat Kartı Çıkart
                      </Button>
                    )}
                    {user.yetki !== "operator" && selectedRows[musteriAdi]?.length > 0 && (
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteSelectedRecordsHandler(musteriAdi)}
                      >
                        Toplu Sil ({selectedRows[musteriAdi].length})
                      </Button>
                    )}
                  </>
                }
              />
            ),
            extra: (
              <IrsaliyeyeGonder
                musteriAdi={musteriAdi}
                selectedRows={selectedRows}
                setSelectedRowKeys={setSelectedRowKeys}
                setUretimGirisleri={setUretimGirisleri}
              />
            ),
          }))}
        />
      ) : (
        <Alert description={`Üretim girişi bulunamadı.`} type="warning" showIcon />
      )}
    </div>
  );
}

function IrsaliyeyeGonder({ musteriAdi, selectedRows, setSelectedRowKeys, setUretimGirisleri }) {
  const musteriKayitlari = selectedRows[musteriAdi];
  const { showNotification, showAlert } = useUIContext();
  const { irsaliyeler, setIrsaliyeler } = useDBContext();

  const seciliFarkliReferansSayisi = useMemo(
    () => new Set(musteriKayitlari?.map((item) => item.referansNo)).size,
    [musteriKayitlari],
  );

  const irsaliyeVerisiOlustur = (data) => {
    const koduOlmayanUretimVar = data.find((kayit) =>
      kayit.Referanslar.kodu.toLowerCase().includes("yok"),
    );

    if (seciliFarkliReferansSayisi > 10) {
      throw new Error(
        `En fazla 10 adet farklı referans seçebilirsiniz. Seçtiğiniz referans sayısı: ${seciliFarkliReferansSayisi}`,
      );
    } else if (koduOlmayanUretimVar) {
      throw new Error(
        "Kodu olmayan bir üretim irsaliyeye gönderilemez. Lütfen seçimleri düzeltiniz. ",
      );
    } else {
      const gruplanmisData = data.reduce((acc, item) => {
        // Tipi belirle
        let tip = "sevk";
        if (item.iade === "Evet") {
          tip = "tasima";
        }

        // Gruplama anahtarını oluştur
        const key = `${item.referansNo}-${tip}`;

        // Eğer accumulator'da (acc) şu anki item için bir kayıt varsa, üretimAdedi değerini topla ve uretimId'leri string olarak ekle
        if (acc[key]) {
          acc[key].uretimAdedi += item.uretimAdedi;
          // ? uretimGirisi id leri;
          acc[key].uretimGirisiIdleri = acc[key].uretimGirisiIdleri + "," + item.id; // String olarak ID'leri birleştir
          acc[key].uretimId = item.uretimId;
        } else {
          // Eğer yoksa, yeni bir kayıt olarak ekle, tipi ayarla ve ilk uretimId'yi string olarak ekle
          acc[key] = {
            ...item,
            uretimGirisiIdleri: item.id.toString(),
            uretimId: item.uretimId,
            tip,
          };
          // delete acc[key].id; // her kayıdın id lerini sil (kayıt eşsizliğini bozmamak için)
        }

        return acc;
      }, {});

      return Object.values(gruplanmisData);
    }
  };

  const irsaliyeyeGonder = async (e) => {
    e.stopPropagation();

    // console.log("Müşteri Kayıtları: ", musteriKayitlari);

    // ? Bir müşteri için, farklı referans numaralarından en fazla 10 kayıt bulunabilir. Daha fazlasını kabul etmiyoruz.
    // ? Kayıt iade ise taşıma ve sipariş no ile talep no boş ise taşıma, diğer durumlarda sevk irsaliyesine gönderilecek

    Modal.confirm({
      title: "Emin misiniz?",
      content: `Seçtiğiniz kayıtlar ${musteriAdi} müşterisine irsaliye kesmek için kaydedilecek. Onaylıyor musunuz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        const limit = 10;
        setSelectedRowKeys({}); // seçilmiş bütün alanları temizle
        try {
          const irsaliyeVerisi = irsaliyeVerisiOlustur(musteriKayitlari);

          console.log("İrsaliye Verisi: ", irsaliyeVerisi);

          const tasimaIrsaliyeleri = irsaliyeVerisi.filter(
            (eklenecekIrsaliye) => eklenecekIrsaliye.tip === "tasima",
          );

          const sevkIrsaliyeleri = irsaliyeVerisi.filter(
            (eklenecekIrsaliye) => eklenecekIrsaliye.tip === "sevk",
          );

          const musteridekiMevcutIrsaliyeler = irsaliyeler.filter(
            (mevcutIrsaliye) => mevcutIrsaliye.Referanslar.musteriAdi === musteriAdi,
          );

          const musteridekiTasimaIrsaliyeleri = musteridekiMevcutIrsaliyeler.filter(
            (mevcutIrsaliye) => mevcutIrsaliye.tip === "tasima",
          );

          const musteridekiSevkIrsaliyeleri = musteridekiMevcutIrsaliyeler.filter(
            (mevcutIrsaliye) => mevcutIrsaliye.tip === "sevk",
          );

          const musterideOlacakToplamSevkIrsaliyeleri = [
            ...musteridekiSevkIrsaliyeleri,
            ...sevkIrsaliyeleri,
          ];
          const musterideOlacakToplamTasimaIrsaliyeleri = [
            ...musteridekiTasimaIrsaliyeleri,
            ...tasimaIrsaliyeleri,
          ];

          const refBazliToplamSevkSayisi = new Set(
            musterideOlacakToplamSevkIrsaliyeleri.map((item) => item.referansNo),
          ).size;
          const refBazliToplamTasimaSayisi = new Set(
            musterideOlacakToplamTasimaIrsaliyeleri.map((item) => item.referansNo),
          ).size;

          console.log("refBazliToplamSevkSayisi", refBazliToplamSevkSayisi);
          console.log("refBazliToplamTasimaSayisi", refBazliToplamTasimaSayisi);

          const sevkKayitlari = irsaliyeVerisi.filter((item) => item.tip === "sevk");
          if (sevkKayitlari.length > 0) {
            if (refBazliToplamSevkSayisi <= limit) {
              const butunIrsaliyeler = await irsaliyeHttp.addData(sevkKayitlari);
              await uretimGirisleriHttp.aktiflikDegistir(false, musteriKayitlari);
              const uretimGirisleri = await uretimGirisleriHttp.getData();

              setIrsaliyeler(butunIrsaliyeler);
              setUretimGirisleri(uretimGirisleri);

              showNotification(
                "success",
                `${musteriAdi} müşterisine ait sevk irsaliyesi kesilecek kayıtlar irsaliye sayfasına eklendi.`,
              );
            } else {
              showAlert(
                "error",
                alertMessage(musteriAdi, "sevk irsaliyesi", refBazliToplamSevkSayisi, limit),
              );
            }
          }

          const tasimaKayitlari = irsaliyeVerisi.filter((item) => item.tip === "tasima");
          if (tasimaKayitlari.length > 0) {
            if (refBazliToplamTasimaSayisi <= limit) {
              const butunIrsaliyeler = await irsaliyeHttp.addData(tasimaKayitlari);
              await uretimGirisleriHttp.aktiflikDegistir(false, musteriKayitlari);
              const uretimGirisleri = await uretimGirisleriHttp.getData();

              setIrsaliyeler(butunIrsaliyeler);
              setUretimGirisleri(uretimGirisleri);
              showNotification(
                "success",
                `${musteriAdi} müşterisine ait taşıma irsaliyesi kesilecek kayıtlar irsaliye sayfasına eklendi.`,
              );
            } else {
              showAlert(
                "error",
                alertMessage(musteriAdi, "taşıma irsaliyesi", refBazliToplamTasimaSayisi, limit),
              );
            }
          }
        } catch (error) {
          showAlert("error", error.message);
        }
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  return (
    <div>
      {musteriKayitlari?.length > 0 && (
        <Badge count={seciliFarkliReferansSayisi} overflowCount={99999999} color="#44961a">
          <Button onClick={irsaliyeyeGonder}>İrsaliyeye Gönder</Button>
        </Badge>
      )}
    </div>
  );
}
