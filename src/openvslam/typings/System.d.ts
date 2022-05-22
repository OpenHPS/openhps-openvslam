import { Config } from './Config';
import { Mat } from '@u4/opencv4nodejs';
import { MapPublisher } from './MapPublisher';
import { FramePublisher } from './FramePublisher';

export class System {
    constructor(config: Config, vocabFilePath: string);

    config: Config;

    getMapPublisher(): MapPublisher;

    getFramePublisher(): FramePublisher;

    startup(initialize?: boolean): void;

    feedMonocularFrame(image: Mat, timestamp: number): void;

    feedStereoFrame(imageLeft: Mat, imageRight: Mat, timestamp: number): void;

    feedRGBDFrame(image: Mat, depth: Mat, timestamp: number): void;

    loadMap(path: string): void;

    saveMap(path: string): void;

    /**
     * Disable mapping
     */
    disableMapping(): void;

    /**
     * Enable mapping
     */
    enableMapping(): void;

    /**
     * Shutdown the system
     */
    shutdown(): void;

    reset(): void;

    terminate(): void;
}
