import { DataObject, SerializableObject, SerializableSetMember } from "@openhps/core";
import { Landmark } from "./Landmark";

@SerializableObject()
export class Map extends DataObject {
    @SerializableSetMember(Landmark)
    landmarks: Set<Landmark>;
}
