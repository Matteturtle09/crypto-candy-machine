<script>
  import BuySection from "../lib/components/BuySection.svelte";
  import Hero from "../lib/components/Hero.svelte";
  import Navbar from "../lib/components/Navbar.svelte";
  import CardDisplay from "../lib/components/CardDisplay.svelte";
  import {cardStore} from "$lib/stores.js"
</script>

<Navbar />
<Hero />
<BuySection />
{#each $cardStore as card}
<CardDisplay {card}/>
{/each}

