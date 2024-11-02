const Cart = require("../model/Cart");

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;

    const { productId, size, qty } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );

    if (existItem) {
      throw new Error("이미 존재하는 상품입니다.");
    }

    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    res.status(200).json({
      status: "success",
      product: cart,
      cartIemQty: cart.items.length,
    });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = cartController;
