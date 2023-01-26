import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

const messageHash = "a33321f98e4ff1c283c76998f14f57447545d339b3db534c6d886decb4209f28";


function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    const signature = await secp.sign(messageHash, privateKey);
    const publicKey = secp.getPublicKey(privateKey);

    const address = toHex(publicKey);
    setAddress(address);

    const param = {
      "signature": toHex(signature),
      "publicKey": toHex(publicKey),
      "messageHash": messageHash
    };


    if (address) {
      // const {
      //   data: { balance },
      // } = await server.get(`balance/${param}`);
      const {
        data: { balance },
      } = await server.post('balance', param);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address.slice(0, 10)}... 
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
