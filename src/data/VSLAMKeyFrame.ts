import { Matrix4, Quaternion, SerializableObject, TimeService, TimeUnit } from '@openhps/core';
import { KeyFrame } from '../openvslam';
import { VSLAMFrame } from './VSLAMFrame';
import { VSLAMLandmark } from './VSLAMLandmark';

@SerializableObject()
export class VSLAMKeyFrame extends VSLAMFrame {
    willBeErased = false;

    /**
     * Create a VSLAM keyframe from native object
     *
     * @param {Keyframe} keyframe Native object
     * @returns {VSLAMKeyFrame} VSLAM keyframe instance
     */
    static fromNative(keyframe: KeyFrame): VSLAMKeyFrame {
        const mapKeyframe = new VSLAMKeyFrame();
        mapKeyframe.uid = keyframe.id.toString();
        const json = keyframe.toJSON();
        mapKeyframe.uid = json.src_frm_id;
        mapKeyframe.createdTimestamp = TimeUnit.MILLISECOND.convert(json['ts'], TimeService.getUnit());
        const pose = new Matrix4().identity();
        pose.makeRotationFromQuaternion(Quaternion.fromRotationMatrix(new Matrix4().fromArray(json.rot_cw)));
        pose.setPosition(json.trans_cw[0], json.trans_cw[1], json.trans_cw[2]);
        mapKeyframe.cameraPose = pose;
        return mapKeyframe;
    }

    /**
     * Get frame landmarks
     *
     * @returns {VSLAMLandmark[]} Array of landmarks found in this frame
     */
    get landmarks(): VSLAMLandmark[] {
        return this.getObjects(VSLAMLandmark);
    }

    /**
     * Set frame landmarks
     *
     * @param {VSLAMLandmark[]} values Array of landmarks
     */
    set landmarks(values: VSLAMLandmark[]) {
        values.forEach(this.addObject.bind(this));
    }

    /**
     * Add a landmark to the frame
     *
     * @param {VSLAMLandmark} landmark Landmark to add
     */
    addLandmark(landmark: VSLAMLandmark): void {
        this.addObject(landmark);
    }
}
