import { Config } from "./Config";
import { Mat } from 'opencv4nodejs';

export class System {

    constructor(config: Config, vocabFilePath: string);

    startup(initialize?: boolean): void;

    feedMonocularFrame(image: Mat, timestamp: number): void;

    feedStereoFrame(imageLeft: Mat, imageRight: Mat, timestamp: number): void;

    loadMap(path: string): void;

    saveMap(path: string): void;

    disableMapping(): void;

    enableMapping(): void;

    shutdown(): void;

}
