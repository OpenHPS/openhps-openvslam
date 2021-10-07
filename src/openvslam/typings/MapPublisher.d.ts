import { Landmark } from "./Landmark";
import { System } from "./System";

export class MapPublisher {

    protected constructor(system: System);

    getCurrentCamPose(): number[];

    getKeyFrames(): any[];

    getAllLandmarks(): Landmark[];

    getLocalLandmarks(): Landmark[];
}
