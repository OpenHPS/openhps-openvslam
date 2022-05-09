import { SerializableObject, Matrix4, LengthUnit } from '@openhps/core';
import { VideoFrame } from '@openhps/opencv';

@SerializableObject()
export class VSLAMFrame extends VideoFrame {
    /**
     * Get the camera pose at the time of the frame
     *
     * @returns {Matrix4} Camera pose as a matrix with translation and rotation 
     */
    get cameraPose(): Matrix4 {
        if (this.source && this.source.getPosition()) {
            const vector = this.source.getPosition().toVector3(LengthUnit.METER);
            const matrix = new Matrix4().identity();
            matrix.setPosition(vector.x, vector.y, vector.z);
            matrix.makeRotationFromQuaternion(this.source.getPosition().orientation);
            return matrix;
        } else {
            return new Matrix4().identity();
        }
    }
}
