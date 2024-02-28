<script lang="ts">
  export let address: string;
  export let isStopped: boolean = false;
  const mint = () => {
  };
  const stop = () => {
  };
  const transfer = (to: string, amout: string) => {
  };
  const trust = (to: string) => {
  };
  const untrust = (to: string) => {
  };
  const invite = (to: string) => {
  };
</script>

<button disabled={isStopped}>Mint</button>
<button disabled={isStopped}>Stop</button>
<button>Transfer</button>
<button>Trust</button>
<button>Untrust</button>
<button>Invite</button>