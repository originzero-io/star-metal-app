import { Button, Card, Modal, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useUIContext } from "context/UIProvider";

import AmbalajForm from "components/forms/AmbalajForm";
import { useDBContext } from "context/DBProvider";
import ambalajlarHttp from "services/ambalajlar.http";
import styled from "styled-components";
import PageHeader from "components/shared/PageHeader";
import { FaDropbox } from "react-icons/fa";
import { useAuth } from "context/AuthProvider";

const Container = styled.div``;

function Ambalajlar() {
  const { user } = useAuth();

  const { showPanel, showNotification, showAlert } = useUIContext();
  const { ambalajlar, setAmbalajlar } = useDBContext();

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.kasaAdi} isimli ambalajı silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newMusteriler = await ambalajlarHttp.deleteData(ambalajlar, [record]);
          setAmbalajlar(newMusteriler);
          showNotification("success", `${record.kasaAdi} ambalajı silindi`);
        } catch (error) {
          showAlert("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  return (
    <Container>
      <PageHeader label="Ambalajlar" icon={<FaDropbox />} />
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Card
          hoverable
          style={{
            width: 240,
            margin: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3vmin",
            background: "#1677ff",
            color: "whitesmoke",
          }}
          onClick={() => showPanel({ title: "Yeni Ambalaj", content: <AmbalajForm /> })}
        >
          <Button
            type="link"
            style={{
              fontSize: "2vmin",
              color: "whitesmoke",
              display: "flex",
              alignItems: "center",
            }}
            icon={<PlusCircleOutlined style={{ fontSize: "3.2vmin" }} />}
          >
            Ambalaj Ekle
          </Button>
        </Card>
        {ambalajlar.map((ambalaj) => (
          <Card
            key={ambalaj.id}
            hoverable
            style={{ width: 240, margin: "10px" }}
            cover={
              <img
                alt="example"
                src={`http://localhost:6333/uploads/ambalajlar/${ambalaj.resimUrl}`}
                height={200}
              />
            }
            actions={[
              <Tooltip key="edit" placement="bottom" title="Düzenle">
                <EditOutlined
                  style={{ fontSize: "1.5vmin" }}
                  onClick={() =>
                    showPanel({
                      title: "Düzenle",
                      content: <AmbalajForm record={ambalaj} type="update" />,
                    })
                  }
                />
              </Tooltip>,
              user.yetki === "admin" && (
                <Tooltip key="delete" placement="bottom" title="Sil">
                  <DeleteOutlined
                    style={{ fontSize: "1.5vmin" }}
                    onClick={() => deleteSingleRecordHandler(ambalaj)}
                  />
                </Tooltip>
              ),
            ].filter(Boolean)}
          >
            <Card.Meta title={ambalaj.kasaAdi} />
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default Ambalajlar;
