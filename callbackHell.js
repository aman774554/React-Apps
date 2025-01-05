function getUser(callback) {
  setTimeout(() => {
    console.log("Fetched user data");
    callback({ userId: 1, name: "John" });
  }, 1000);
}

function getOrders(userId, callback) {
  setTimeout(() => {
    console.log(`Fetched orders for userId ${userId}`);
    callback([{ orderId: 101 }, { orderId: 102 }]);
  }, 1000);
}

function getOrderDetails(orderId, callback) {
  setTimeout(() => {
    console.log(`Fetched details for orderId ${orderId}`);
    callback({ orderId, details: "Order details here" });
  }, 1000);
}

// Nesting of callbacks (Callback Hell)
getUser((user) => {
  getOrders(user.userId, (orders) => {
    orders.forEach((order) => {
      getOrderDetails(order.orderId, (orderDetails) => {
        console.log(orderDetails);
      });
    });
  });
});
