function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Usage with .then()
delay(2000).then(() => {
  console.log("This message is delayed by 2 seconds.");
});


async function delayedExecution() {
  console.log("Start delay...");
  await delay(2000); // Waits for 2 seconds
  console.log("This message appears after a 2-second delay.");
}

delayedExecution();
