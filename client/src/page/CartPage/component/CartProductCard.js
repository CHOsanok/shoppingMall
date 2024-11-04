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
  const handleQtyChange = (value, maxQty) => {
    console.log(item.productId.name);

    if (value * 1 > maxQty) {
      dispatch(
        showToastMessage({
          message: `${item.productId.name}상품이 최대 수량을 초과했습니다.`,
          status: "success",
        })
      );
    } else {
      setQty(value);
    }
  };

  const handleQtyUpdate = (id) => {
    dispatch(updateQty({ id, value: qty }));
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
            <input
              className="qty-dropdown"
              disabled={loading}
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
              max={item.productId.stock[item.size]}
            />
            <button
              onClick={() => {
                handleQtyUpdate(item._id);
              }}
            >
              snffj
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CartProductCard;
