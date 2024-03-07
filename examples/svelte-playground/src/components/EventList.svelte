<script lang="ts" context="module">
  import { Avatar } from '@circles-sdk/sdk/dist/sdk/src';
  import { get, writable } from 'svelte/store';
  import type { AvatarEvent } from '@circles-sdk/sdk/dist/sdk/src/avatar';
  import { onMount } from 'svelte';

  const events = writable<AvatarEvent[]>([]);

  const bigintReplacer = (key: string, value: any) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  };

  export function subscribeAvatar(avatar: Avatar) {
    avatar.lastEvent.subscribe((event) => {
      const e = get(events);
      e.unshift(event);
      events.set(e);

      const storedEvents = localStorage.getItem('avatarEvents');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        parsedEvents.push(event);
        localStorage.setItem('avatarEvents', JSON.stringify(parsedEvents, bigintReplacer));
      } else {
        localStorage.setItem('avatarEvents', JSON.stringify([event], bigintReplacer));
      }
    });
  }
</script>
<script lang="ts">
  import Collapsible from './common/VerticalCollapsible.svelte';

  onMount(() => {
    const storedEvents = localStorage.getItem('avatarEvents');
    if (storedEvents) {
      events.set(JSON.parse(storedEvents));
    }
  });
</script>
<div>
  <ul style="list-style: none">
    {#each $events as event}
      <li>
        <Collapsible label={event.name} isOpen={false}>
          <pre>{JSON.stringify(event.data, bigintReplacer, 2)}</pre>
        </Collapsible>
      </li>
    {/each}
  </ul>
</div>