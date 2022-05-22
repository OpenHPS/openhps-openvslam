import { DataObject, SerializableObject, SerializableSetMember } from '@openhps/core';
import { VSLAMKeyFrame } from './VSLAMKeyFrame';
import { VSLAMLandmark } from './VSLAMLandmark';

@SerializableObject()
export class VSLAMMap extends DataObject {
    @SerializableSetMember(VSLAMLandmark)
    landmarks: Set<VSLAMLandmark>;
    @SerializableSetMember(VSLAMKeyFrame)
    keyFrames: Set<VSLAMKeyFrame>;

    /**
     * Create a VSLAM map from native object
     *
     * @returns {VSLAMMap} VSLAM map instance
     */
    static fromNative(): VSLAMMap {
        const map = new VSLAMMap();
        return map;
    }
}
