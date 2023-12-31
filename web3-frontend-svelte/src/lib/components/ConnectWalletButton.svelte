<script>
  import { ethers } from "ethers";
  import { onMount } from "svelte";
  import { providerStore, signerStore, accountStore } from "$lib/stores.js";

  let signer = null;

  let address;
  let provider;
  let connected;
  async function requestProvider() {
    if (window.ethereum == null) {
      console.log("MetaMask not installed; using read-only defaults");
      provider = ethers.getDefaultProvider();
    } else {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x5",
            rpcUrls: ["https://eth-goerli.public.blastapi.io"],
            chainName: "Goerli TestNet",
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ],
      });
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      
      providerStore.set(provider);
      signerStore.set(signer);
      connected = true;
      /*
      const tx = signer.sendTransaction({
        to: "0x6AeD2aFd19b3c0aE7b9eC0f24177b5CF49628563",
        value: ethers.parseEther("0.00001"),
      });*/
      address = await signer.getAddress();
    }
  }

  async function displayOnMetamask() {
    const wasAdded = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: "0x44AA3C7Bb422D724e4E91d0a641Cea58f1429e86", // The address of the token.
          symbol: "$C", // A ticker symbol or shorthand, up to 5 characters.
          decimals: 18, // The number of decimals in the token.
          image: "https://em-content.zobj.net/source/google/350/coin_1fa99.png", // A string URL of the token logo.
        },
      },
    });
  }

  onMount(async () => {
    await requestProvider();
    window.ethereum.on('accountsChanged', function (accounts) {
        accountStore.set(accounts[0] ); // change the store to  new address
    });

  });

</script>

{#if !connected}
  <button
    on:click={async () => {
      await requestProvider();
    }}
    class="btn btn-accent normal-case text-xl text-base-100">Connect</button
  >
{:else}
  {#if window.ethereum.isMetaMask}
    <button
      class="mr-2 hidden md:inline btn btn-accent normal-case text-xl text-base-100"
      on:click|once={async () => {
        await displayOnMetamask();
      }}
      ><img
        class="w-full h-full"
        alt="metamask logo"
        src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/SVG_MetaMask_Icon_Color.svg"
      />
    </button>
  {/if}
  <button
    on:click={async () => {
      await requestProvider();
    }}
    class="btn btn-accent no-animation normal-case text-xl text-base-100"
    >Connected <h1 class="hidden md:inline md:w-32 text-xl truncate ...">
      {$accountStore || address} 
    </h1></button
  >
{/if}
