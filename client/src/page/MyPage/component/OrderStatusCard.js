import React from "react";
import { Row, Col, Badge, Button } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { useDispatch } from "react-redux";
import { deleteOrder } from "../../../features/order/orderSlice";

const OrderStatusCard = ({ orderItem }) => {
  const dispatch = useDispatch();
  console.log(orderItem._id);

  const handleDeleteOrder = () => {
    dispatch(deleteOrder(orderItem));
  };

  return (
    <div>
      <Row className="status-card">
        <Col xs={2}>
          <img
            src={orderItem.items[0]?.productId?.image}
            alt={orderItem.items[0]?.productId?.name}
            height={96}
          />
        </Col>
        <Col xs={8} className="order-info">
          <div>
            <strong>주문번호: {orderItem.orderNum}</strong>
          </div>

          <div className="text-12">{orderItem.createdAt.slice(0, 10)}</div>

          <div>
            {orderItem.items[0].productId.name}
            {orderItem.items.length > 1 && `외 ${orderItem.items.length - 1}개`}
          </div>
          <div>₩ {orderItem.totalPrice.toLocaleString()}</div>
          <Button size="sm" onClick={() => handleDeleteOrder()}>
            주문취소
          </Button>
        </Col>
        <Col md={2} className="vertical-middle">
          <div className="text-align-center text-12">주문상태</div>
          <Badge bg={badgeBg[orderItem.status]}>{orderItem.status}</Badge>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStatusCard;
