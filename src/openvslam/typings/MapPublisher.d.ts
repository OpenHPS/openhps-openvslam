import { KeyFrame } from './KeyFrame';
import { Landmark } from './Landmark';

export class MapPublisher {
    private constructor();

    /**
     * Get the current camera pose as column-major 4x4 matrix
     *
     * @returns {number[]} column-major 4x4 matrix (16 elements)
     */
    getCurrentCamPose(): number[];

    getKeyFrames(): KeyFrame[];

    getLandmarks(): [Landmark[], Landmark[]];

    getAllLandmarks(): Landmark[];

    getLocalLandmarks(): Landmark[];
}
