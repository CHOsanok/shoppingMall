import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { showToastMessage } from "../../../features/common/uiSlice";
import { ModalBox } from "../../../common/component/ModalBox";

const CartProductCard = ({ item, modifying, setModifying }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const [qty, setQty] = useState(item.qty);
  const [qtyModify, setQtyModify] = useState(false);
  const [delteItem, setDeleteItem] = useState(false);
  const stockStatus = item.qty > item.productId.stock[item.size];

  const handleQtyChange = (value) => {
    if (!qtyModify) {
      setModifying([...modifying, "modifying"]);
    }

    setQtyModify(true);
    if (value * 1 === 0 || value === "" || stockStatus) setDeleteItem(true);
    if (value > item.productId.stock[item.size]) {
      setQty(item.productId.stock[item.size]);
      dispatch(
        showToastMessage({
          message: `'${item.productId.name}'상품의 최대 주문 가능 수량은 '${
            item.productId.stock[item.size]
          }'개입니다.`,
          status: "error",
        })
      );
    } else {
      setQty(value);
    }
  };

  const handleQtyModify = (id, value) => {
    if (value === "상품 수정") {
      setQtyModify(!qtyModify);
      setModifying(modifying.slice(0, -1));
      if (qty * 1 !== item.qty && qty !== "0") {
        dispatch(updateQty({ id, value: qty }));
      }
      if (qty * 1 === 0) deleteItem();
    } else {
      setQty(item.qty);
      setQtyModify(!qtyModify);
      setModifying(modifying.slice(0, -1));
    }
  };

  const deleteItem = () => {
    if (!delteItem) {
      setQty(item.qty);
      setDeleteItem(!delteItem);
    } else {
      setModifying(modifying.slice(0, -1));
      dispatch(deleteCartItem(item._id));
    }
  };

  return (
    <div className="product-card-cart ">
      <ModalBox
        show={delteItem}
        setDeleteItem={setDeleteItem}
        deleteItem={deleteItem}
        content={`${item.productId.name} : ${item.size} 상품을 삭제 하시겠습니까?`}
      />
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12} className="cartText">
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                icon={faTrash}
                width={24}
                onClick={() => deleteItem()}
              />
            </button>
          </div>

          <div>
            <strong>₩ {item.productId.price.toLocaleString()}</strong>
          </div>
          <div>Size: {item.size.toUpperCase()}</div>
          <div>
            Total: ₩ {(item.productId.price * item.qty).toLocaleString()}
          </div>
          <div>
            Quantity:
            <input
              className="qty-dropdown"
              disabled={loading}
              value={qty}
              onChange={(event) => handleQtyChange(event.target.value)}
              required
              type="number"
              placeholder="0"
              max={item.productId.stock[item.size] + 1}
              min={0}
            />
            {qtyModify && (
              <>
                <Button
                  className="btn-ok"
                  size="sm"
                  onClick={(event) => {
                    handleQtyModify(item._id, event.target.textContent);
                  }}
                >
                  상품 수정
                </Button>
                <Button
                  className="btn-cancel"
                  size="sm"
                  onClick={(event) => {
                    handleQtyModify(item._id, event.target.textContent);
                  }}
                >
                  취소
                </Button>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
