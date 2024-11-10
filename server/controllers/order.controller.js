const orderController = {};
const Order = require("../model/Order");
const randomStringGenerator = require("../utils/randomStringGenerator");
const productController = require("./product.conrtoller");

orderController.deleteOrder = async (req, res) => {
  try {
    const { deleteOrder } = req.body;
    const { id } = req.params;

    if (!id) {
      throw new Error("주문정보 오류");
    }

    for (const item of deleteOrder) {
      await productController.cancelItem(item);
    }

    const cancelOrder = await Order.deleteOne({ _id: id });

    res.status(200).json({ status: "success", cancelOrder });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;

    const insufficientStockItems = await productController.checkItemListStock(
      orderList
    );

    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce(
        (total, item) => (total += item.message),
        ""
      );
      throw new Error(errorMessage);
    }

    for (const item of orderList) {
      await productController.completedOrder(item);
    }

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
orderController.getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const orderList = await Order.find({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
        select: "image name",
      },
    });

    res.status(200).json({ status: "success", orderList });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const { page, orderNum } = req.query;
    const cond = orderNum
      ? { orderNum: { $regex: orderNum, $options: "i" } }
      : {};
    const response = { status: "success" };
    const PAGE_SIZE = 5;
    const LIMIT = 5;

    let query = Order.find(cond)
      .populate("userId")
      .populate({
        path: "items",
        populate: {
          path: "productId",
          model: "Product",
          select: "image name",
        },
      })
      .sort({ createdAt: -1 });

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(LIMIT);
      const totalItemNum = await Order.find(cond).countDocuments();
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }
    const orderList = await query.exec();
    response.order = orderList;

    res.status(200).json({ status: "success", data: response });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      throw new Error("주문 정보가 없습니다.");
    }

    res.status(200).json({ status: "success", data: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
