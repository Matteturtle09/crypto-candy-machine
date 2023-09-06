import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import BigNumber from "bignumber.js";

const sdk = new ThirdwebSDK("goerli", {
  secretKey:
    "9FZn6hmjtWQHOeQSBDE7ESzbHXsFFBBPr2I0mO1Ur24kT9eUYWyLtynCprWxEuOuHK_B_Rhq5V1ng2jAtcmISg",
});

const contract = await sdk.getContract(
  "0xC40821263Ef1F7c266248e30511543eDD2Ef222E"
);

const unsubscribe = contract.events.listenToAllEvents((event) => {
  console.log(event.eventName); // the name of the emitted event
  if (
    event.eventName == "Transfer" &&
    event.data.to == "0x6AeD2aFd19b3c0aE7b9eC0f24177b5CF49628563"
  ) {
    console.log(event.data.value);
    let mousecoinValue = new BigNumber(event.data.value._hex);
    mousecoinValue = +mousecoinValue;
    console.log(
      `${event.data.from} ha inviato ${mousecoinValue} Mousecoin a ${event.data.to}`
    );
    if (mousecoinValue >= 1000000000000000000) {
      let numberOfProducts = Math.floor(mousecoinValue/1000000000000000000)
      console.log(`Successfully bought ${numberOfProducts} products`)
    }
  }
});
