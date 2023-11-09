<script>
  import { providerStore, signerStore } from "$lib/stores.js";
  import { ethers } from "ethers";
  import abi from "/workspace/crypto-candy-machine/web3-frontend-svelte/src/lib/tokenabi.json";
  import JSConfetti from "js-confetti";
  import { cooledDown } from "$lib/stores.js";

  export let numberOfProducts;
  export let price;
  let signer;
  let provider;
  signerStore.subscribe((value) => {
    signer = value;
  });
  providerStore.subscribe((value) => {
    provider = value;
  });

  async function buyProduct(e) {
    const jsConfetti = new JSConfetti();
    cooledDown.set(true);
    if (signer != null) {
      const contract = new ethers.Contract(
        "0x44AA3C7Bb422D724e4E91d0a641Cea58f1429e86",
        abi,
        provider
      );
      console.log(price);
      const contractSigner = contract.connect(signer);
      let contract_name = await contract.totalSupply();
      console.log(contract_name);
      try {
        let tx = await contractSigner.transfer(
          "0x6AeD2aFd19b3c0aE7b9eC0f24177b5CF49628563",
          ethers.parseEther(price)
        );
        let receipt = await tx.wait();
        console.log(receipt);
        if (receipt.status == 1) {
          cooledDown.set(false);
          await jsConfetti.addConfetti({
            emojis: ["🍬", "🍭", "🌸"],
            confettiNumber: numberOfProducts * 50,
          });
          jsConfetti.clearCanvas();
        }
      } catch (e) {
        cooledDown.set(false);
      }
    }
  }
</script>

{#if !$cooledDown}
  <button
    on:click={async () => {
      await buyProduct();
    }}
    id="sendButton"
    class="btn w-full">Buy with coins</button
  >
{:else}
  <button
    disabled="disabled"
    on:click={async () => {
      await buyProduct();
    }}
    id="sendButton"
    class="btn w-full">Buy with coins</button
  >
{/if}
