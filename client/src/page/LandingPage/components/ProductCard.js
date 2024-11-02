import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  const soldCheck = Object.values(item.stock).every((stock) => stock === 0);

  return (
    <>
      {soldCheck ? (
        <div className="card soldOut" onClick={() => showProduct(item._id)}>
          <div className="soldText">Sold Out</div>
          <img src={item?.image} alt="imageCard" />
          <div>{item?.name}</div>
          <div>₩ {(item?.price).toLocaleString()}</div>
        </div>
      ) : (
        <div className="card" onClick={() => showProduct(item._id)}>
          <img src={item?.image} alt="imageCard" />
          <div>{item?.name}</div>
          <div>₩ {(item?.price).toLocaleString()}</div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
