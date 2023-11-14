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
  let currentNetwork;

  $: price = (numberOfProducts * unitPrice).toFixed(1);
  signerStore.subscribe((value) => {
    signer = value;
  });

  providerStore.subscribe(async (value) => {
    provider = value;

  });
  
  $: provider?.getNetwork().then((network) => { currentNetwork = network;})
  $: console.log(currentNetwork)
</script>

{#if currentNetwork !== undefined && currentNetwork.chainId == '0x5' && currentNetwork.name == 'goerli'}
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
      <PayWithCoins {price} {numberOfProducts} />
      <PayWithCard {numberOfProducts} />
    {/if}
  </form>
</div>
{/if}
