function getUser(callback) {
  setTimeout(() => {
    console.log("Fetched user data");
    callback({ userId: 1, name: "Aman" });
  }, 1000);
}

function getOrder(userId, callback) {
  setTimeout(() => {
    console.log(`Fetched order for userId ${userId}`);
    callback({ orderId: 101 });
  }, 1000);
}

function getOrderDetails(orderId, callback) {
  setTimeout(() => {
    console.log(`Fetched details for orderId ${orderId}`);
    callback({ orderId, details: "Order details here" });
  }, 1000);
}

// Simplified callback nesting
getUser((user) => {
  getOrder(user.userId, (order) => {
    getOrderDetails(order.orderId, (orderDetails) => {
      console.log(orderDetails);
    });
  });
});


###########################################################################
async function fetchOrderDetails() {
  try {
    const user = await getUser();
    const order = await getOrder(user.userId);
    const orderDetails = await getOrderDetails(order.orderId);
    console.log(orderDetails);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchOrderDetails();

################################################################################

function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetched user data");
      resolve({ userId: 1, name: "John" });
    }, 1000);
  });
}

function getOrder(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetched order for userId ${userId}`);
      resolve({ orderId: 101 });
    }, 1000);
  });
}

function getOrderDetails(orderId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Fetched details for orderId ${orderId}`);
      resolve({ orderId, details: "Order details here" });
    }, 1000);
  });
}

// Chaining Promises
getUser()
  .then((user) => getOrder(user.userId))
  .then((order) => getOrderDetails(order.orderId))
  .then((orderDetails) => {
    console.log(orderDetails);
  })
  .catch((error) => console.error("Error:", error));

##################################################################
Promise hell

getUser()
  .then((user) => {
    getOrder(user.userId)
      .then((order) => {
        getOrderDetails(order.orderId)
          .then((details) => {
            console.log(details);
          })
          .catch((err) => {
            console.error("Error fetching order details:", err);
          });
      })
      .catch((err) => {
        console.error("Error fetching order:", err);
      });
  })
  .catch((err) => {
    console.error("Error fetching user:", err);
  });

