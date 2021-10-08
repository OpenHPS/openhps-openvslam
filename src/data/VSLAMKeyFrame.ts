import { SerializableObject } from '@openhps/core';
import { VSLAMFrame } from './VSLAMFrame';
import { VSLAMLandmark } from './VSLAMLandmark';

@SerializableObject()
export class VSLAMKeyFrame extends VSLAMFrame {
    static fromNativeJSON(json: any): VSLAMKeyFrame {
        const keyframe = new VSLAMKeyFrame();
        return keyframe;
    }

    /**
     * Get frame landmarks
     *
     * @returns {VSLAMLandmark[]} Array of landmarks found in this frame
     */
    get landmarks(): VSLAMLandmark[] {
        return this.getObjects(VSLAMLandmark);
    }

    /**
     * Set frame landmarks
     *
     * @param {VSLAMLandmark[]} values Array of landmarks
     */
    set landmarks(values: VSLAMLandmark[]) {
        values.forEach(this.addObject);
    }

    /**
     * Add a landmark to the frame
     *
     * @param {VSLAMLandmark} landmark Landmark to add
     */
    addLandmark(landmark: VSLAMLandmark): void {
        this.addObject(landmark);
    }
}
