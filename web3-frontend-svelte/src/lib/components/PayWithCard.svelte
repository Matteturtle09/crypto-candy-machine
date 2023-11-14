<script>
  export let numberOfProducts;
  import toIPFSgateway from "$lib/toIPFSgateway.js";
  import { cooledDown } from "$lib/stores.js";
  import {
    providerStore,
    signerStore,
    cardStore,
    accountStore,
  } from "$lib/stores.js";
  import { ethers } from "ethers";
  import abi from "$lib/cardabi.json";
  import { onMount } from "svelte";
  import JSConfetti from "js-confetti";
  import { PUBLIC_ERC1155_CONTRACT_ADDRESS } from "$env/static/public";
  let signer, provider;
  let ownedCards = [];

  signerStore.subscribe((value) => {
    signer = value;
  });
  providerStore.subscribe((value) => {
    provider = value;
  });
  cardStore.subscribe((value) => {
    ownedCards = value;
  })
  accountStore.subscribe(async(value) => {
    if (signer != null) {
        cardStore.set([]);
        const contract = new ethers.Contract(
          PUBLIC_ERC1155_CONTRACT_ADDRESS,
          abi,
          provider
        );
        const contractSigner = contract.connect(signer);
        let nextTokenIdToMint = await contract.nextTokenIdToMint();
        for (let step = nextTokenIdToMint; step >= 0; step--) {
          if ((await contract.balanceOf(value, step)) > 0) {
            let nftRes = await fetch(toIPFSgateway(await contract.uri(step)));
            ownedCards.push(await nftRes.json());
            cardStore.set(ownedCards);
            ownedCards = ownedCards;
          }
        }
      }
  });

  async function buyProduct(e) {
    if (!$cooledDown && ownedCards.length > 0) {
      console.log( ownedCards.length)
      /* let orderRes = await fetch("/cardPay", {
        method: "POST",
        body: JSON.stringify({ orderQty: numberOfProducts, apiKey: API_KEY }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(await orderRes.json());*/
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
          PUBLIC_ERC1155_CONTRACT_ADDRESS,
          abi,
          provider
        );
        const contractSigner = contract.connect(signer);
        let nextTokenIdToMint = await contract.nextTokenIdToMint();
        for (let step = nextTokenIdToMint; step >= 0; step--) {
          if ((await contract.balanceOf($accountStore || await signer.getAddress(), step)) > 0) {
            let nftRes = await fetch(toIPFSgateway(await contract.uri(step)));
            ownedCards.push(await nftRes.json());
            cardStore.set(ownedCards);
            ownedCards = ownedCards;
          }
        }
      }
    }, 100);
  });
</script>

{#if ownedCards.length > 0}
  {#if !$cooledDown}
    <button
      id="sendButton"
      on:click={async () => {
        await buyProduct();
      }}
      class="btn w-full">Buy with card</button
    >
  {:else}
    <button disabled="disabled" id="sendButton" class="btn w-full"
      >Buy with card</button
    >
  {/if}
{/if}
