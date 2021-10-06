import { System } from "./System";
import { Mat } from 'opencv4nodejs';

export class FramePublisher {

    protected constructor(system: System);

    drawFrame(): Mat;
}
