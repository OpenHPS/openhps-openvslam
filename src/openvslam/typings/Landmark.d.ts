import { KeyFrame } from './KeyFrame';

export class Landmark {
    protected constructor();

    id: number;

    getReferenceKeyframe(): KeyFrame;

    getPosInWorld(): number[];

    getNumObserved(): number;

    getNumObservable(): number;

    willBeErased(): boolean;

    toJSON(): any;
}
