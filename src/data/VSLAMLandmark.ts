import { Absolute3DPosition, DataObject, LengthUnit, SerializableObject } from '@openhps/core';

@SerializableObject()
export class VSLAMLandmark extends DataObject {

    static fromNativeJSON(json: any): VSLAMLandmark {
        const mapLandmark = new VSLAMLandmark();
        mapLandmark.setPosition(new Absolute3DPosition(
            json.pos_w[0], json.pos_w[1], json.pos_w[2], LengthUnit.METER
        ));
        return mapLandmark;
    }

}
