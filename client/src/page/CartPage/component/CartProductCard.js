import React, { useEffect, useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { updateQty, deleteCartItem } from "../../../features/cart/cartSlice";
import { showToastMessage } from "../../../features/common/uiSlice";

const CartProductCard = ({ item }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.cart);
  const [qty, setQty] = useState(item.qty);

  useEffect(() => {
    setQty(item.qty);
  }, [item]);
  const handleQtyChange = (id, value, maxQty) => {
    if (maxQty === value * 1) {
      dispatch(
        showToastMessage({
          message: "최대 상품 주문 횟수 입니다.",
          status: "success",
        })
      );
    } else {
      dispatch(updateQty({ id, value }));
    }
  };

  const deleteCart = (id) => {
    dispatch(deleteCartItem(id));
  };

  return (
    <div className="product-card-cart">
      <Row>
        <Col md={2} xs={12}>
          <img src={item.productId.image} width={112} alt="product" />
        </Col>
        <Col md={10} xs={12}>
          <div className="display-flex space-between">
            <h3>{item.productId.name}</h3>
            <button className="trash-button">
              <FontAwesomeIcon
                disabled={loading}
                icon={faTrash}
                width={24}
                onClick={() => deleteCart(item._id)}
              />
            </button>
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
            <Form.Control
              className="qty-dropdown"
              disabled={loading}
              defaultValue={item.qty}
              value={qty}
              onChange={(event) =>
                handleQtyChange(
                  item._id,
                  event.target.value,
                  item.productId.stock[item.size]
                )
              }
              required
              type="number"
              placeholder="0"
              max={item.productId.stock[item.size]}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
