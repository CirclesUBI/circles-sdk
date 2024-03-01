<script lang="ts" context="module">
    import {Avatar} from "@circles-sdk/sdk/dist/sdk/src";
    import {get, writable} from "svelte/store";
    import type {AvatarEvent} from "@circles-sdk/sdk/dist/sdk/src/avatar";


    let events = writable<AvatarEvent[]>([]);

    export function subscribeAvatar(avatar: Avatar) {
        avatar.lastEvent.subscribe((event) => {
            const e = get(events);
            e.unshift(event);
            events.set(e);
        });
    }
</script>
<script lang="ts">
    import Collapsible from "./common/VerticalCollapsible.svelte";
</script>
<div>
    <ul>
        {#each $events as event}
            <li>
                <Collapsible label={event.name} isOpen={false}>
                    <pre>{JSON.stringify(event.data, (a, b, c) => {
                        if (typeof b === 'bigint') {
                            return b.toString();
                        } else {
                            return b;
                        }
                    }, 2)}</pre>
                </Collapsible>
            </li>
        {/each}
    </ul>
</div>