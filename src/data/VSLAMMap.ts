import { DataObject, SerializableObject, SerializableSetMember } from '@openhps/core';
import { VSLAMKeyFrame } from './VSLAMKeyFrame';
import { VSLAMLandmark } from './VSLAMLandmark';

@SerializableObject()
export class VSLAMMap extends DataObject {
    @SerializableSetMember(VSLAMLandmark)
    landmarks: Set<VSLAMLandmark>;
    @SerializableSetMember(VSLAMKeyFrame)
    keyFrames: Set<VSLAMKeyFrame>;
    @SerializableSetMember(VSLAMLandmark)
    localLandmarks: Set<VSLAMLandmark>;
}
