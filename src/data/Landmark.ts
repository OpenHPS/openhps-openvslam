import { DataObject, SerializableObject } from '@openhps/core';
import { KeyFrame } from './KeyFrame';

@SerializableObject()
export class Landmark extends DataObject {
    keyframe: KeyFrame;
}
