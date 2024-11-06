import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { showToastMessage } from "../../../features/common/uiSlice";

const OrderReceipt = ({ cartList, totalPrice, currentModify }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePayment = () => {
    if (currentModify) {
      return dispatch(
        showToastMessage({
          message: `상품이 수정 중입니다.`,
          status: "success",
        })
      );
    }
    navigate("/payment");
  };

  return (
    <div className="receipt-container">
      <h3 className="receipt-title">주문 내역</h3>
      <ul className="receipt-list">
        <li>
          {cartList.length > 0 &&
            cartList.map((item, index) => (
              <div className="display-flex space-between" key={index}>
                <div>{item.productId.name}</div>
                <div>
                  ₩ {(item.productId.price * item.qty).toLocaleString()}
                </div>
              </div>
            ))}
        </li>
      </ul>
      <div className="display-flex space-between receipt-title">
        <div>
          <strong>Total:</strong>
        </div>
        <div>
          <strong>₩ {totalPrice.toLocaleString()}</strong>
        </div>
      </div>
      {location.pathname.includes("/cart") && cartList.length > 0 && (
        <Button
          variant="dark"
          className="payment-button"
          onClick={() => handlePayment()}
        >
          결제 계속하기
        </Button>
      )}

      <div>
        가능한 결제 수단 귀하가 결제 단계에 도달할 때까지 가격 및 배송료는
        확인되지 않습니다.
        <div>
          30일의 반품 가능 기간, 반품 수수료 및 미수취시 발생하는 추가 배송 요금
          읽어보기 반품 및 환불
        </div>
      </div>
    </div>
  );
};

export default OrderReceipt;
