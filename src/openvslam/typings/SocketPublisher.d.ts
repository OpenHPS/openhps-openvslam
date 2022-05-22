import { System } from './System';

export class SocketPublisher {
    constructor(system: System, url: string);

    run(): void;

    terminate(): void;
}
