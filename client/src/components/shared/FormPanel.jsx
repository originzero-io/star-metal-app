import { Drawer } from "antd";
import { useUIContext } from "context/UIProvider";

const FormPanel = () => {
  const { panel, showPanel } = useUIContext();

  const key =
    panel.content?.props?.record?.id ||
    panel.content?.props?.record?.logoRef ||
    panel.content?.props?.record?.logicalref ||
    panel.content?.props?.record?.logoMalzemeRef;

  const onOk = () => {
    showPanel(false);
  };

  const onClose = () => {
    showPanel(false);
  };
  return (
    <Drawer
      title={panel.title}
      styles={{
        header: {
          padding: "8px 14px",
          background: "#edf1fb",
        },
        body: {
          background: "#edf1fb",
        },
      }}
      key={key} // başka kayıtlar seçildiğinde içerik otomatik değişsin diye benzersiz key
      open={panel.title}
      onOk={onOk}
      onClose={onClose}
      maskClosable={false}
      centered
      width={panel.width || 500}
      // footer={null}
      mask={false}
    >
      {panel.content}
    </Drawer>
  );
};

export default FormPanel;
