import { Drawer } from "antd";
import { useUIContext } from "context/UIProvider";

const FormPanel = () => {
  const { panel, showPanel } = useUIContext();

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
          // background: "#dce0e3",
          background: "#edf1fb",
        },
        body: {
          background: "#edf1fb",
        },

        // mask: { background: "transparent" },
      }}
      key={panel.content?.props?.record?.id} // başka kayıtlar seçildiğinde içerik otomatik değişsin diye benzersiz key
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
