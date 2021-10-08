import { KeyFrame } from './KeyFrame';
import { Landmark } from './Landmark';

export class MapPublisher {
    private constructor();

    getCurrentCamPose(): number[];

    getKeyFrames(): KeyFrame[];

    getAllLandmarks(): Landmark[];

    getLocalLandmarks(): Landmark[];
}
