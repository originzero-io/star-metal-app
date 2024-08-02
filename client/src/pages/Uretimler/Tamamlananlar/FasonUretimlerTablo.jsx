import { CaretRightOutlined, TruckOutlined } from "@ant-design/icons";
import { Collapse, Flex, Modal, Tag, Tooltip } from "antd";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
import ExcelButton from "components/shared/ExcelButton";
import IdBadge from "components/shared/IdBadge";
import collapseStyle from "components/shared/StyledCollapse";
import TableGod from "components/shared/TableGod";
import { useAuth } from "context/AuthProvider";
import { useUIContext } from "context/UIProvider";
import { downloadExcel } from "react-export-table-to-excel";
import { createTableFilterFromData } from "utils/table.helper";
import UretimSevkiyatHareketleri from "../DevamEdenler/UretimSevkiyatHareketleri";

export default function FasonUretimlerTablo({ fasonFirmasiBazliKayitlar, uretimiSilFunc }) {
  const { user } = useAuth();
  const { showPanel, showNotification } = useUIContext();

  const createColumnsForCustomer = (fasonFirmasi) => [
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      render: (text) => <IdBadge value={text} />,
      sorter: (a, b) => a.id - b.id,
      width: 77,
    },
    {
      title: "Müşteri",
      // dataIndex: "musteriAdi",
      key: "fasonFirmasi",
      render: (text, record) => (
        <Tooltip title={record.musteriAdi}>
          <Tag
            style={{
              width: "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "bold",
            }}
          >
            {record.musteriAdi}
          </Tag>
        </Tooltip>
      ),
      width: 130,
    },
    {
      title: "Sipariş Tipi",
      dataIndex: "siparisTipi",
      key: "siparisTipi",
      render: (text, record) => <ColumnBadge value={record.siparisTipi} />,
      filters: [
        ...new Set(fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.siparisTipi)),
      ].map((siparisTipi) => ({
        text: siparisTipi,
        value: siparisTipi,
      })),
      onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 120,
    },
    {
      title: "Kodu",
      dataIndex: "kodu",
      key: "kodu",
      render: (text, record) => <ColumnBadge value={record.kodu} />,
      filters: createTableFilterFromData(fasonFirmasiBazliKayitlar[fasonFirmasi], "kodu"),
      onFilter: (value, record) => record.kodu.indexOf(value) === 0,
      filterSearch: true,
      width: 135,
    },
    {
      title: "Referans",
      dataIndex: "referansNo",
      key: "referansNo",
      filters: createTableFilterFromData(fasonFirmasiBazliKayitlar[fasonFirmasi], "referansNo"),
      onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text) => <ColumnBadge value={text} />,
      width: 120,
    },
    {
      title: "İade",
      dataIndex: "iade",
      key: "iade",
      filters: createTableFilterFromData(fasonFirmasiBazliKayitlar[fasonFirmasi], "iade"),
      onFilter: (value, record) => record.iade.indexOf(value) === 0,
      filterSearch: true,
      width: 80,
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
      render: (text) => <ColumnBadge value={text} />,
    },
    {
      title: "Fasona Gönderilen",
      dataIndex: "gidenMiktar",
      key: "gidenMiktar",
      sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      render: (text) => <ColumnBadge value={text} />,
    },
    {
      title: "Fasonda Üretilen",
      dataIndex: "uretilenMiktar",
      key: "uretilenMiktar",
      sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      render: (text) => <ColumnBadge value={text} />,
    },
    {
      title: "Sevk Edilen",
      dataIndex: "sevkEdilenMiktar",
      key: "sevkEdilenMiktar",
      render: (text) => <ColumnBadge value={text} />,
      sorter: (a, b) => a.sevkEdilenMiktar - b.sevkEdilenMiktar,
    },
    {
      title: "İşlem Tipi",
      render: (text, record) => <ColumnBadge value={record.islemTipi} />,
      key: "islemTipi",
      filters: [
        ...new Set(fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.islemTipi)),
      ].map((islemTipi) => ({
        text: islemTipi,
        value: islemTipi,
      })),
      onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
      filterSearch: true,
    },
  ];

  const downloadExcelHandler = (fasonFirmasi, dataSource) => {
    // const header = ["Firstname", "Lastname", "Age"];
    // const body = [["Edison", "Padilla", 14]];
    const columns = createColumnsForCustomer(fasonFirmasi);

    Modal.confirm({
      title: "Emin misiniz?",
      content: "Bu tablo excel formatında indirilecek.",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        try {
          const header = columns.map((column) => column.title);

          const body = dataSource.map((data) => ({
            id: data.id,
            musteri: data.musteriAdi,
            siparisTipi: data.siparisTipi,
            kodu: data.kodu,
            referansNo: data.referansNo,
            iade: data.iade,
            irsaliyeNo: data.irsaliyeNo,
            gelenTarih: data.gelenTarih,
            gelenMiktar: data.gelenMiktar,
            gidenMiktar: data.gidenMiktar,
            uretilenMiktar: data.uretilenMiktar,
            sevkEdilenMiktar: data.sevkEdilenMiktar,
            islemTipi: data.islemTipi,
          }));

          downloadExcel({
            fileName: `TAMAMLANANLAR-${fasonFirmasi.split(" ")[0]}.xls`,
            tablePayload: {
              header,
              body,
            },
          });
          showNotification("success", "Excel başarıyla indirildi");
        } catch (error) {
          showNotification("error", `Dosya indirilirken hata: ${error.message}`);
        }
      },
    });
  };

  return (
    <Collapse
      bordered={false}
      size="small"
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={Object.entries(fasonFirmasiBazliKayitlar).map(([fasonFirmasi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Flex align="center">
              <div style={collapseStyle.subCollapseHeader}>{fasonFirmasi}</div>
              <CountBadge>{kayitlar.length}</CountBadge>
            </Flex>
            {user.yetki !== "operator" && (
              <ExcelButton
                onClick={(e) => {
                  e.stopPropagation();
                  downloadExcelHandler(fasonFirmasi, kayitlar);
                }}
              />
            )}
          </div>
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={createColumnsForCustomer(fasonFirmasi)}
            scroll={{ x: 1500 }}
            contextMenu={{
              extraItems: (record) => [
                user.yetki !== "operator" && {
                  icon: <TruckOutlined />,
                  title: "Üretim / Sevkiyat Hareketleri",
                  action: () =>
                    showPanel({
                      title: "Üretim / Sevkiyat Hareketleri",
                      content: <UretimSevkiyatHareketleri record={record} />,
                      width: 1500,
                    }),
                },
              ],
            }}
          />
        ),
        style: collapseStyle.subCollapseItem,
      }))}
    />
  );
}
