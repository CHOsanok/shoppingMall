import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { showToastMessage } from "../../../features/common/uiSlice";

const CartProductCard = ({ item, currentModify, setCurrentModify }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const [qty, setQty] = useState(item.qty);
  const [qtyModify, setQtyModify] = useState(false);
  const [delteItem, setDeleteItem] = useState(false);

  useEffect(() => {
    setQty(item.qty);
  }, [item]);

  const handleQtyChange = (value, maxQty) => {
    if (value * 1 === maxQty + 1 || value * 1 > maxQty) {
      dispatch(
        showToastMessage({
          message: `상품의 최대 주문 가능 수량인 ${maxQty}개를 초과하였습니다. 구매 가능 수량을 확인해주세요.`,
          status: "success",
        })
      );
    } else {
      setQty(value);
    }
  };

  const handleQtyModify = (id) => {
    if (qtyModify) {
      dispatch(updateQty({ id, value: qty }));
      setCurrentModify(!currentModify);
    }
    setCurrentModify(!currentModify);
    setQtyModify(!qtyModify);
  };

  const handleModifyCancel = () => {
    setQty(item.qty);
    setCurrentModify(!currentModify);
    setQtyModify(!qtyModify);
  };

  const deleteCart = (id) => {
    setDeleteItem(true);
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="product-card-cart ">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            {delteItem ? (
              <div>삭제중...</div>
            ) : (
              <button className="trash-button">
                <FontAwesomeIcon
                  disabled={loading}
                  icon={faTrash}
                  width={24}
                  onClick={() => deleteCart(item._id)}
                />
              </button>
            )}
          </div>

          <div>
            <strong>₩ {item.productId.price.toLocaleString()}</strong>
          </div>
          <div>Size: {item.size}</div>
          <div>
            Total: ₩ {(item.productId.price * item.qty).toLocaleString()}
          </div>
          <div>
            Quantity:
            {qtyModify ? (
              <input
                className="qty-dropdown"
                value={qty}
                onChange={(event) =>
                  handleQtyChange(
                    event.target.value,
                    item.productId.stock[item.size]
                  )
                }
                required
                type="number"
                placeholder="0"
                max={item.productId.stock[item.size] + 1}
              />
            ) : (
              <div>{qty}</div>
            )}
            <button
              onClick={() => {
                handleQtyModify(item._id);
              }}
            >
              {qtyModify ? "완료" : "상품 수정"}
            </button>
            {qtyModify && (
              <button
                onClick={() => {
                  handleModifyCancel();
                }}
              >
                취소
              </button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
