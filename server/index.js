const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0466a90aad5c8368c6127cb5973d040112b7e6d023674f9c518aacadfff78c3cc1aca43672e9ee3db6bfe8c53a4f273ce3d5973551db9521b4ca106a7258d39d1e": 100,
  "047567065443fb531265a77225bec2df77cd1d4d5fc687ad1871f817e637e4742a997a2331ce3cda3de03019fd5518adef0cfbde77c399ee2f87082707677c29a6": 50,
  "04bf1f7dff12acd0dfe35ebcc54a96b47f7d28f3dbd6fb1b4645dd1449cf7c90eae2bf6ece8eff964a71240c9ae041a12f87ea5e6af8ad0523b16f4d84ab585ccc": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
