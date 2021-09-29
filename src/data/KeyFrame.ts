import { SerializableObject, Matrix4, SerializableMember } from "@openhps/core";

@SerializableObject()
export class KeyFrame {
    @SerializableMember()
    cameraPose: Matrix4;
}
