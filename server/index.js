import "dotenv/config";
import { Contract, ethers, utils } from "ethers";
import BigNumber from "bignumber.js";
import tokenAbi from "./tokenabi.json" assert { type: "json" };
import * as mqtt from "mqtt";
console.log(process.env.ERC20_CONTRACT_ADDRESS);

const client = mqtt.connect(process.env.MQTT_SERVER_ADDRESS, {
  username: process.env.MQTT_SERVER_USERNAME || "",
  password: process.env.MQTT_SERVER_PASSWORD || "",
});
const provider = new ethers.providers.WebSocketProvider(
  process.env.ETH_PROVIDER,
  "goerli"
);

client.on("connect", () => {
  client.subscribe("crypto-candy-machine/#", (err) => {
    if (!err) {
      console.log(err);
      client.publish("crypto-candy-machine/server", "Online");
      const interval = setInterval(function () {
        client.publish("crypto-candy-machine/server", "Online");
      }, 10000);      
    } else {
      console.log(err);
    }
  });
});

const tokenContract = new ethers.Contract(
  process.env.ERC20_CONTRACT_ADDRESS,
  tokenAbi,
  provider
);

const block = await provider.getBlockNumber();

let transferEvents = await tokenContract.queryFilter(
  "Transfer",
  block - 50000,
  block
);
transferEvents = transferEvents.map((event) => {
  return {
    value: ethers.utils.formatEther(event.args.value),
    from: event.args.from,
    to: event.args.to,
  };
});

tokenContract.on("Transfer", (from, to, value, event) => {
  if (to == process.env.ETH_SHOP_ADDRESS) {
    client.publish("crypto-candy-machine/txs", {
      value: ethers.utils.formatEther(value),
      from: from,
      to: to,
    });
  }

  console.log(event.blockNumber);
});
