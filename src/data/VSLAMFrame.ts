import { SerializableObject, Matrix4 } from '@openhps/core';
import { VideoFrame } from '@openhps/opencv';

@SerializableObject()
export class VSLAMFrame extends VideoFrame {
    get cameraPose(): Matrix4 {
        return undefined;
    }
}
