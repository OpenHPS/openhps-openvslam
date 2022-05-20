import { KeyFrame } from './KeyFrame';
import { Landmark } from './Landmark';

export class MapPublisher {
    private constructor();

    getCurrentCamPose(): number[];

    getKeyFrames(): KeyFrame[];

    getLandmarks(): { allLandmarks: Landmark[], localLandmarks: Landmark[] };
    
    getAllLandmarks(): Landmark[];

    getLocalLandmarks(): Landmark[];
}
