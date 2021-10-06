import { SerializableMember, SerializableObject } from '@openhps/core';
import { VSLAMFrame } from './VSLAMFrame';
import { VSLAMGraphNode } from './VSLAMGraphNode';
import { MapLandmark } from './MapLandmark';

@SerializableObject()
export class VSLAMKeyFrame extends VSLAMFrame {
    @SerializableMember()
    graphNode: VSLAMGraphNode;

    /**
     * Get frame landmarks
     *
     * @returns {MapLandmark[]} Array of landmarks found in this frame
     */
    get landmarks(): MapLandmark[] {
        return this.getObjects(MapLandmark);
    }

    /**
     * Set frame landmarks
     *
     * @param {MapLandmark[]} values Array of landmarks 
     */
    set landmarks(values: MapLandmark[]) {
        values.forEach(this.addObject);
    }

    /**
     * Add a landmark to the frame
     *
     * @param {MapLandmark} landmark Landmark to add 
     */
    addLandmark(landmark: MapLandmark): void {
        this.addObject(landmark);
    }
}
