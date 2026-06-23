# Callback hell 
function getUser(callback) {
  setTimeout(() => {
    callback("Aman");
  }, 1000);
}

function getOrder(user, callback) {
  setTimeout(() => {
    callback("Order-101");
  }, 1000);
}

function getDetails(order, callback) {
  setTimeout(() => {
    callback("Laptop");
  }, 1000);
}

getUser((user) => {
  getOrder(user, (order) => {
    getDetails(order, (details) => {
      console.log(user, order, details);
    });
  });
});


###########################################################################
# Async/Await
function getUser() {
  return Promise.resolve("Aman");
}

function getOrder(user) {
  return Promise.resolve("Order-101");
}

function getDetails(order) {
  return Promise.resolve("Laptop");
}

async function fetchData() {
  const user = await getUser();
  const order = await getOrder(user);
  const details = await getDetails(order);

  console.log(user);
  console.log(order);
  console.log(details);
}

fetchData();
################################################################################
#Promise

function getUser() {
  return Promise.resolve("Aman");
}

function getOrder(user) {
  return Promise.resolve("Order-101");
}

function getDetails(order) {
  return Promise.resolve("Laptop");
}

getUser()
  .then((user) => getOrder(user))
  .then((order) => getDetails(order))
  .then((details) => console.log(details))
  .catch((err) => console.log(err));

##################################################################
