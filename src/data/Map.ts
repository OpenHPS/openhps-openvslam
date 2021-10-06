import { DataObject, SerializableObject, SerializableSetMember } from '@openhps/core';
import { VSLAMKeyFrame } from './VSLAMKeyFrame';
import { MapLandmark } from './MapLandmark';

@SerializableObject()
export class Map extends DataObject {
    @SerializableSetMember(MapLandmark)
    landmarks: Set<MapLandmark>;
    @SerializableSetMember(VSLAMKeyFrame)
    keyFrames: Set<VSLAMKeyFrame>;
    @SerializableSetMember(MapLandmark)
    localLandmarks: Set<MapLandmark>;

    /**
     * Get the origin key frame
     *
     * @returns {VSLAMKeyFrame} Origin key frame
     */
    get origin(): VSLAMKeyFrame {
        return this.keyFrames.values().next().value;
    }
}
