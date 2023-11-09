<script>
  export let numberOfProducts;
  export let price;
  import toIPFSgateway from '$lib/toIPFSgateway.js'
  import {cooledDown} from "$lib/stores.js"
  import { providerStore, signerStore, cardStore} from "$lib/stores.js";
  import { ethers } from "ethers";
  import abi from "$lib/cardabi.json";
  import { onMount } from "svelte";
  import JSConfetti from "js-confetti";

  let signer, provider;
  signerStore.subscribe((value) => {
    signer = value;
  });
  providerStore.subscribe((value) => {
    provider = value;
  });
  let ownedCards = [];

  async function buyProduct(e) {
    if (!$cooledDown) {

		  cooledDown.set(true);
      setTimeout(async () => {
        cooledDown.set(false);
      }, 10000);
      const jsConfetti = new JSConfetti();
      if (Math.random() > 0.9) {
        await jsConfetti.addConfetti({
          emojis: ["🍬", "🍭", "🌸", "💳"],
          confettiNumber: numberOfProducts * 50,
        });
      } else {
        await jsConfetti.addConfetti({
          emojis: ["🍬", "🍭", "🌸"],
          confettiNumber: numberOfProducts * 50,
        });
      }

      jsConfetti.clearCanvas();
    }
  }

  onMount(async () => {
    setTimeout(async () => {
      if (signer != null) {
        const contract = new ethers.Contract(
          "0xD3dF5c4175b808503E16F4f49E3C1abC205889ba",
          abi,
          provider
        );
        const contractSigner = contract.connect(signer);
        let nextTokenIdToMint = await contract.nextTokenIdToMint();
        for (let step = nextTokenIdToMint; step >= 0; step--) {
          if ((await contract.balanceOf(await signer.getAddress(), step)) > 0) {
            let res =  await fetch(toIPFSgateway(await contract.uri(step)))
            ownedCards.push(await res.json());
            cardStore.set(ownedCards)
            ownedCards = ownedCards;
          }
        }
      }
    }, 100);
  });
</script>

{#if ownedCards.length > 0}
  {#if !$cooledDown}
    <button id="sendButton" on:click={async() => {await buyProduct()}} class="btn w-full">Buy with card</button>
  {:else}
    <button disabled="disabled" id="sendButton" class="btn w-full">Buy with card</button>
  {/if}
  
    
{/if}
