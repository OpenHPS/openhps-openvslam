import { DataObject, SerializableObject, SerializableSetMember } from '@openhps/core';
import { KeyFrame } from './KeyFrame';
import { Landmark } from './Landmark';

@SerializableObject()
export class Map extends DataObject {
    @SerializableSetMember(Landmark)
    landmarks: Set<Landmark>;
    @SerializableSetMember(KeyFrame)
    keyFrames: Set<KeyFrame>;
}
