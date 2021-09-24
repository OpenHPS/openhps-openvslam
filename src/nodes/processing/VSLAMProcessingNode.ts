import { ProcessingNode, ProcessingNodeOptions } from '@openhps/core';
import { StereoVideoFrame, VideoFrame } from '@openhps/opencv/dist/cjs';

export class VSLAMProcessingNode
    <In extends VideoFrame | StereoVideoFrame, 
    Out extends VideoFrame | StereoVideoFrame> extends ProcessingNode<In, Out> {

    process(data: In): Promise<Out> {
        return new Promise((resolve, reject) => {

        });
    }

}

export interface VSLAMProcessingNodeOptions extends ProcessingNodeOptions {
    
}
