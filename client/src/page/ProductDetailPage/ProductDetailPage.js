import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./style/productDetail.style.css";
import { getProductDetail } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";
import { Lodaing } from "../../common/component/Lodaing";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { selectedProduct, loading } = useSelector((state) => state.product);
  const cartLoading = useSelector((state) => state.cart.loading);
  const [size, setSize] = useState("");
  const { id } = useParams();
  const [sizeError, setSizeError] = useState(false);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  const addItemToCart = () => {
    if (size === "") {
      return setSizeError(true);
    }
    if (!user) {
      navigate("/login");
    }
    dispatch(addToCart({ id, size }));
  };
  const selectSize = (value) => {
    if (sizeError) {
      setSizeError(false);
    }
    setSize(value);
  };

  useEffect(() => {
    dispatch(getProductDetail(id));
  }, [id, dispatch]);

  if (loading || !selectedProduct) return <Lodaing />;
  return (
    <Container className="product-detail-card">
      <Row>
        <Col sm={6}>
          <img
            src={selectedProduct.image}
            className="w-100"
            alt="productImage"
          />
        </Col>
        <Col className="product-info-area" sm={6}>
          <div className="product-info">{selectedProduct.name}</div>
          <div className="product-info">
            ₩ {selectedProduct.price.toLocaleString()}
          </div>
          <div className="product-info">{selectedProduct.description}</div>

          <Dropdown
            className="drop-down size-drop-down"
            title={size}
            align="start"
            onSelect={(value) => selectSize(value)}
          >
            <Dropdown.Toggle
              className="size-drop-down"
              variant={sizeError ? "outline-danger" : "outline-dark"}
              id="dropdown-basic"
              align="start"
            >
              {size === "" ? "사이즈 선택" : size.toUpperCase()}
            </Dropdown.Toggle>

            <Dropdown.Menu className="size-drop-down">
              {Object.keys(selectedProduct.stock).length > 0 &&
                Object.keys(selectedProduct.stock).map((item, index) =>
                  selectedProduct.stock[item] > 0 ? (
                    <Dropdown.Item eventKey={item} key={index}>
                      {`${item.toUpperCase()} : 재고수량 ${
                        selectedProduct.stock[item]
                      }`}
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item eventKey={item} disabled={true} key={index}>
                      {`${item.toUpperCase()} : 상품 재고가 없습니다.`}
                    </Dropdown.Item>
                  )
                )}
            </Dropdown.Menu>
          </Dropdown>
          <div className="warning-message">
            {sizeError && "사이즈를 선택해주세요."}
          </div>
          <Button
            disabled={cartLoading}
            variant="dark"
            className={cartLoading ? "add-button disabled" : "add-button"}
            onClick={addItemToCart}
          >
            {cartLoading ? "추가중..." : "추가"}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
