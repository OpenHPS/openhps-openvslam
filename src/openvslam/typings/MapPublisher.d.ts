import { KeyFrame } from "./KeyFrame";
import { Landmark } from "./Landmark";
import { System } from "./System";

export class MapPublisher {

    protected constructor(system: System);

    getCurrentCamPose(): number[];

    getKeyFrames(): KeyFrame[];

    getAllLandmarks(): Landmark[];

    getLocalLandmarks(): Landmark[];
}
