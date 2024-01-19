import { Modal } from "antd";
import { useUIContext } from "context/UIProvider";
import { useRef, useState } from "react";
import Draggable from "react-draggable";

const FormModal = () => {
  const { modal, showModal } = useUIContext();

  const [disabled, setDisabled] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const draggleRef = useRef(null);

  const handleOk = () => {
    showModal(false);
  };

  const handleCancel = () => {
    showModal(false);
    setPosition({ x: 0, y: 0 });
    setDisabled(true);
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  const onStop = (e, data) => {
    setPosition({ x: data.x, y: data.y }); // Update position
  };

  return (
    <Modal
      title={
        <div
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
            background:
              "linear-gradient(90deg, rgba(35,34,50,1) 26%, #9f0803 72%, rgba(255,255,255,1) 96%)",
            color: "whitesmoke",
            borderRadius: "4px",
            padding: "6px",
            paddingLeft: "12px",
            cursor: "move",
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
        >
          {modal.title}
        </div>
      }
      open={modal.title}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      centered
      width={1000}
      footer={null}
      modalRender={(_modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          nodeRef={draggleRef}
          position={position}
          onStart={onStart}
          onStop={onStop}
        >
          <div ref={draggleRef}>{_modal}</div>
        </Draggable>
      )}
    >
      {modal.content}
    </Modal>
  );
};

export default FormModal;
