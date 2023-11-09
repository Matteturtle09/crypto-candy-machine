<script>
  import toIPFSgateway from "$lib/toIPFSgateway.js";
  export let card;
  import {cooledDown} from "$lib/stores.js"


</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<div class="flex items-left items-center justify-center justify-center mb-4">
  <label class="swap w-3/4 swap-flip ">
    <!-- this hidden checkbox controls the state -->
    <input type="checkbox" />

    <div class="swap-off transition duration-1000">
    <img class="rounded-lg {$cooledDown ? "grayscale" : ""}" alt={card.name} src={toIPFSgateway(card.image)} />
    </div>
    <div
      class="swap-on flex items-center justify-center transition duration-1000"
    >
      <div class="card w-full h-full outline bg-base-100 outline-secondary">
        <div class="card-body">
          <h2 class="card-title">
            {card.name}
          </h2>
          <p>{card.description}</p>
          <div class="card-actions justify-end">
            {#each card.attributes as trait}
              <div class="badge badge-secondary">{trait.value}</div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </label>
</div>
