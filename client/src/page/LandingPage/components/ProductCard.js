import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  const soldCheck = Object.values(item.stock).every((stock) => stock === 0)
    ? "soldOut"
    : "";

  return (
    <div className={`card ${soldCheck}`} onClick={() => showProduct(item._id)}>
      {soldCheck ? <p className="soldText">Sold Out</p> : ""}
      <img src={item?.image} alt="imageCard" />
      <div>{item?.name}</div>
      <div>₩ {(item?.price).toLocaleString()}</div>
    </div>
  );
};

export default ProductCard;
