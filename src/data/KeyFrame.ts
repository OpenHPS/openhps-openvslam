import { SerializableObject, Matrix4, SerializableMember } from '@openhps/core';
import { Frame } from './Frame';

@SerializableObject()
export class KeyFrame extends Frame {
    @SerializableMember()
    cameraPose: Matrix4;
}
