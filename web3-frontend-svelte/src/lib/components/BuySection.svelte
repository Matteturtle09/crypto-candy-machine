<script>
  import PayWithCoins from "./PayWithCoins.svelte";

  import PayWithCard from "./PayWithCard.svelte";
  import { providerStore, signerStore } from "$lib/stores.js";
  import { ethers } from "ethers";
  import abi from "/workspace/crypto-candy-machine/web3-frontend-svelte/src/lib/tokenabi.json";
  import JSConfetti from "js-confetti";

  let numberOfProducts = 1;
  let unitPrice = 1;
  let price;
  let signer;
  let provider;
  $: price = (numberOfProducts * unitPrice).toFixed(1);
  signerStore.subscribe((value) => {
    signer = value;
  });
  providerStore.subscribe((value) => {
    provider = value;
  });

  async function buyProduct(e) {
    const jsConfetti = new JSConfetti();

    if (signer != null) {
      const contract = new ethers.Contract(
        "0x44AA3C7Bb422D724e4E91d0a641Cea58f1429e86",
        abi,
        provider
      );
      const contractSigner = contract.connect(signer);
      let contract_name = await contract.totalSupply();
      console.log(contract_name);
      const tx = await contractSigner.transfer(
        "0x6AeD2aFd19b3c0aE7b9eC0f24177b5CF49628563",
        ethers.parseEther(price)
      );
      let receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status == 1) {
        await jsConfetti.addConfetti({
          emojis: ["🍬", "🍭", "🌸"],
          confettiNumber: numberOfProducts * 50,
        });
        jsConfetti.clearCanvas();
      }
    }
  }
</script>

<h1 class="mt-8 text-4xl font-bold text-center">Buy products</h1>

<div class="flex justify-center items-center my-5 bg-base-100">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <form
    class="space-y-5 w-11/12"
    on:click={(e) => {
      e.preventDefault();
    }}
  >
    <input
      type="number"
      bind:value={numberOfProducts}
      placeholder="Number of Products"
      class="input w-full max-w-2xl"
      max="5"
      min="1"
      step="1"
    />
    <h2>Estimated Price: {price}</h2>
    <input
      bind:value={numberOfProducts}
      type="range"
      min="1"
      max="5"
      class="range"
      step="1"
    />
    <div class="w-full flex justify-between text-xs px-2">
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
      <span>|</span>
    </div>
    {#if numberOfProducts > 0 && numberOfProducts <= 5}
    <PayWithCoins {price} {numberOfProducts}/>
    <PayWithCard {price} {numberOfProducts} />
    {/if}
  </form>
</div>
