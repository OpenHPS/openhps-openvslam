import { SerializableObject, Matrix4, LengthUnit, Absolute3DPosition, Orientation, SerializableMember } from '@openhps/core';
import { VideoFrame } from '@openhps/opencv';

@SerializableObject()
export class VSLAMFrame extends VideoFrame {
    @SerializableMember()
    systemUID: string;

    /**
     * Get the camera pose at the time of the frame
     *
     * @returns {Matrix4} Camera pose as a matrix with translation and rotation
     */
    get cameraPose(): Matrix4 {
        if (this.source && this.source.getPosition()) {
            const vector = this.source.getPosition().toVector3(LengthUnit.METER);
            const matrix = new Matrix4().identity();
            matrix.makeRotationFromQuaternion(this.source.getPosition().orientation);
            matrix.setPosition(vector.x, vector.z, vector.y);
            return matrix;
        } else {
            return new Matrix4().identity();
        }
    }

    /**
     * Set the camera at the time of the frame
     *
     * @param {Matrix4} pose Camera pose
     */
    set cameraPose(pose: Matrix4) {
        if (this.source) {
            const position = new Absolute3DPosition(
                pose.elements[12],
                pose.elements[14],
                pose.elements[13],
                LengthUnit.METER,
            );
            position.orientation = Orientation.fromRotationMatrix(pose);
            this.source.setPosition(position);
        }
    }
}
