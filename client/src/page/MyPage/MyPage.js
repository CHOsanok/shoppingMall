import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, product } = useSelector((state) => state.order);
  const id = useSelector((state) => state.user.user._id);

  useEffect(() => {
    dispatch(getOrder(id));
  }, [dispatch]);

  if (orderList?.length === 0) {
    return (
      <Container className="no-order-box">
        <div>진행중인 주문이 없습니다.</div>
      </Container>
    );
  }
  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          productItem={product}
          className="status-card-container"
          key={item._id}
        />
      ))}
    </Container>
  );
};

export default MyPage;
