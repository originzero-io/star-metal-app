import { CloseCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { useUIContext } from "context/UIProvider";

const FormModal = () => {
  const { modal, showModal } = useUIContext();

  const handleOk = () => {
    showModal(false);
  };

  const handleCancel = () => {
    showModal(false);
  };

  return (
    <Modal
      title={modal.title}
      open={modal.title}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      centered
      width={modal.width}
      footer={null}
      destroyOnClose
      closeIcon={
        <CloseCircleFilled
          style={{
            fontSize: "20px",
            color: "#373737",
          }}
        />
      }
    >
      <div style={{ marginTop: "20px" }}>{modal.content}</div>
    </Modal>
  );
};

export default FormModal;
