const express = require("express");
const app = express();
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04dd2658f2ef96c958379a3cbd8f962a81fab836807b5cd45902ec3bcc86bd178971415014a8a48cc72633d39fc48b1bfd78386adc92e0f4c257e6e8107c665a4a": 100,
  "0463a701d238e29ec1d9464b6d0641aff82a6fe14320d8c871ebbf0ec869f241377d6b4f5abde2e16089f82eaff899bcf38ace274651914a310ff626b39fb2d1bb": 50,
  "0481f2d5541fd2bb5a1853674dccc1b0c51dbc7575923d70ea5dfe2572a7c0e0c0323f2deb6efd7969573fcd74da7f3a2a4273ae29308a7eaff405828498f84035": 75,
};


app.post("/balance", (req, res) => {

  console.log(req.body);

  const params = req.body;
  const isSigned = secp.verify(params.signature, params.messageHash, params.publicKey);

  console.log('isSigned', isSigned);
  if (isSigned) {
    const address = params.publicKey;
    const balance = balances[address] || 0;
    res.send({ balance });
  } else {
    console.log("operation failed!");
  }
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
