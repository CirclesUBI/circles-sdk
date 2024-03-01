<script lang="ts">
    export let action: () => Promise<any>;
    export let doneStateDuration: number = 2000;
    export let errorTransitory: boolean = true;
    export let disabled: boolean = false;

    type State = 'Ready' | 'Working' | 'Error' | 'Retry' | 'Done' | 'Disabled';
    let state: State = 'Ready';
    let errorMessage: string = '';
    let data: unknown = null;

    const executeAction = () => {
        if (disabled || state === 'Done' || state == 'Working') {
            return;
        }
        state = 'Working';
        action()
            .then((result) => {
                data = result;
                state = 'Done';
                setTimeout(() => {
                    // Transition from Done to either Ready or Disabled
                    state = disabled ? 'Disabled' : 'Ready';
                }, doneStateDuration);
            })
            .catch((err) => {
                errorMessage = err.message;
                state = errorTransitory ? 'Error' : 'Retry';
                if (errorTransitory) {
                    setTimeout(() => {
                        state = 'Retry';
                    }, doneStateDuration); // Use the same duration for simplicity
                }
                console.error(err);
            });
    };

    $: if (disabled && state !== 'Done') {
        state = 'Disabled';
    } else if (!disabled && state === 'Disabled') {
        state = 'Ready';
    }
</script>

<button on:click={executeAction}
        style="display: inline-block;"
        title="{errorMessage}"
        class:button-ready={state === 'Ready'}
        class:button-working={state === 'Working'}
        class:button-error={(state === 'Error' || state === 'Retry')}
        class:button-done={state === 'Done'}
        class:button-disabled={state === 'Disabled'}>
    {#if state === 'Working'}
        <div class="loading-spinner" style="display: inline-block;"></div>
    {/if}
    {#if state === 'Retry'}
        <div class="icon retry-icon" style="display: inline-block;">
            ⟳
        </div>
    {:else if state === "Error"}
        <div class="icon warning-icon" style="display: inline-block;">
            ⚠
        </div>
    {:else if state === "Done"}
        <div class="icon checkmark-icon" style="display: inline-block;">
            ✓
        </div>
    {/if}
    <slot/>
</button>