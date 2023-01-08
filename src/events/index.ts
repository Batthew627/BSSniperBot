import { Event } from '../types';
import ready from './ready';
import interactionCreate from './interactionCreate';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const events: Event<any>[]=[
    ready,
    interactionCreate,
];

export default events;
