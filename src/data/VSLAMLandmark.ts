import { Absolute3DPosition, DataObject, LengthUnit, SerializableMember, SerializableObject } from '@openhps/core';
import { Landmark } from '../openvslam';

@SerializableObject()
export class VSLAMLandmark extends DataObject {
    @SerializableMember()
    keyframeUID: string;
    @SerializableMember()
    referenceKeyframeUID: string;
    @SerializableMember()
    observed: number;
    @SerializableMember()
    observable: number;

    /**
     * Create a VSLAM landmark from native object
     *
     * @param {Landmark} landmark Native object
     * @returns {VSLAMLandmark} VSLAM landmark instance
     */
    static fromNative(landmark: Landmark): VSLAMLandmark {
        const mapLandmark = new VSLAMLandmark(landmark.id.toString());
        const json = landmark.toJSON();
        mapLandmark.keyframeUID = json['1st_keyfrm'];
        mapLandmark.referenceKeyframeUID = json['ref_keyfrm'];
        mapLandmark.observable = json['n_vis'];
        mapLandmark.observed = json['n_fnd'];
        if (json.pos_w) {
            mapLandmark.setPosition(
                new Absolute3DPosition(json.pos_w[0], json.pos_w[1], json.pos_w[2], LengthUnit.METER),
            );
        }
        return mapLandmark;
    }

    /**
     * Convert the VSLAM landmark to native JSON serialization
     *
     * @returns {any} Native JSON serialization
     */
    toNativeJSON(): any {
        return undefined;
    }
}
