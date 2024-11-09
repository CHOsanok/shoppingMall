import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { showToastMessage } from "../../../features/common/uiSlice";
import { ModalBox } from "../../../common/component/ModalBox";

const CartProductCard = ({ item, modifying, setModifying }) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(item.qty);
  const [qtyModify, setQtyModify] = useState(false);
  const [delteItem, setDeleteItem] = useState(false);
  const stockStatus = item.qty > item.productId.stock[item.size];

  useEffect(() => {
    if (stockStatus) {
      setQtyModify(true);
      setModifying([...modifying, "modifying"]);
    }
  }, [stockStatus]);

  const handleQtyChange = (value) => {
    if (value * 1 === 0 || value === "") setDeleteItem(true);

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
      setModifying([...modifying, "modifying"]);
      setQtyModify(!qtyModify);
    } else {
      if (value === "완료") {
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
        <Col md={10} xs={12}>
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
            {qtyModify ? (
              <input
                className="qty-dropdown"
                value={qty}
                onChange={(event) => handleQtyChange(event.target.value)}
                required
                type="number"
                placeholder="0"
                max={item.productId.stock[item.size] + 1}
                min={0}
              />
            ) : (
              <div>{stockStatus ? "상품의 재고가 부족합니다." : qty}</div>
            )}
            <Button
              size="sm"
              onClick={(event) => {
                handleQtyModify(item._id, event.target.textContent);
              }}
            >
              {qtyModify ? "완료" : "상품 수정"}
            </Button>
            {qtyModify && (
              <Button
                size="sm"
                onClick={(event) => {
                  handleQtyModify(item._id, event.target.textContent);
                }}
              >
                취소
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
