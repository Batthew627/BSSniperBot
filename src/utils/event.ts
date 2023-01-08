import { Event, EventExec, EventKeys } from '../types';
import { Client, ClientEvents } from 'discord.js';

export function event <T extends EventKeys>(id:T, exec: EventExec<T>):Event<T> {
    return {
        id,
        exec,
    };
}

export function registerEvents(client: Client, events:Event<keyof ClientEvents>[]):void {
    for (const event of events) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.on(event.id, async (...args:any[2])=>{
            const props ={
                client,
                log: (...args:unknown[]) =>{
                    console.log(`[${event.id}]`, ...args);
                },
            };
            try {
                await event.exec(props, ...args);
            } catch (err) {
                props.log('Uncaught Error', err);
            }
        });
    }
}
