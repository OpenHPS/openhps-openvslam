import { GraphNode } from './GraphNode';
import { Landmark } from './Landmark';

export class KeyFrame {
    protected constructor();

    id: number;

    graphNode: GraphNode;

    getCameraPose(): number[];

    getCameraRotation(): number[];

    getCameraTranslation(): number[];

    getLandmarks(): Landmark[];

    getValidLandmarks(): Landmark[];

    willBeErased(): boolean;

    toJSON(): any;
}
