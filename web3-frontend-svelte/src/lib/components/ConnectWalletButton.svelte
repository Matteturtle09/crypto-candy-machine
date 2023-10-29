<script>
  import { ethers } from "ethers";
  import { browser, dev, building, version } from "$app/environment";
  import { onMount } from "svelte";

  let signer = null;

  let provider;
  let connected;
  async function requestProvider() {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      connected = true;
    }
  }
  onMount(async () => {
    await requestProvider();
  });
</script>

{#if !connected}
  <button
    on:click={async () => await requestProvider()}
    class="btn btn-accent normal-case text-xl text-base-100">Connect</button
  >
{:else}
  <button
    on:click={async () => await requestProvider()}
    class="btn btn-accent no-animation normal-case text-xl text-base-100">Connesso</button
  >
{/if}
