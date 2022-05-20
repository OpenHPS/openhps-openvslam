import { SerializableObject, Matrix4, LengthUnit, Absolute3DPosition, Orientation } from '@openhps/core';
import { VideoFrame } from '@openhps/opencv';
import { System } from '../openvslam';

@SerializableObject()
export class VSLAMFrame extends VideoFrame {
    system: System;

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

    /**
     * Set the camera at the time of the frame
     *
     * @param {Matrix4} pose Camera pose
     */
    set cameraPose(pose: Matrix4) {
        if (this.source) {
            const position = new Absolute3DPosition(pose.elements[12], pose.elements[14], pose.elements[13], LengthUnit.METER);
            position.orientation = Orientation.fromRotationMatrix(pose);
            this.source.setPosition(position);
        }    
    }
}
