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
     * Create a VSLAM map from native JSON serialization
     *
     * @param {any} json Native JSON serialization
     */
    static fromNativeJSON(json: any): VSLAMMap {
        const map = new VSLAMMap();
        return map;
    }
}
