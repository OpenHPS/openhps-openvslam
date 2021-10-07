import { DataObject, SerializableObject } from '@openhps/core';

@SerializableObject()
export class MapLandmark extends DataObject {

    static fromNativeJSON(json: any): MapLandmark {
        const mapLandmark = new MapLandmark();
        return mapLandmark;
    }

}
