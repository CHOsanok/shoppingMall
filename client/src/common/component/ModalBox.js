import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ModalBox = ({ show, setDeleteItem, deleteItem, content }) => {
  return (
    <Modal
      show={show}
      backdrop="static modal-dialog-centered"
      keyboard={false}
      centered
    >
      <Modal.Header
        closeButton
        onClick={() => setDeleteItem(false)}
      ></Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setDeleteItem(false)}>
          취소
        </Button>
        <Button variant="danger" onClick={() => deleteItem()}>
          삭제하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
