import { CameraObject } from '@openhps/video';
import * as YAML from 'yaml';
import * as fs from 'fs';

export class VSLAMConfiguration {
    /**
     * Camera object
     */
    camera: CameraObject;

    /**
     * Convert the configuration to YAML string
     *
     * @returns {string} YAML output string
     */
    toYAML(): string {
        return YAML.stringify(this);
    }

    static fromYAML(yamlString: string): VSLAMConfiguration {
        const instance = new VSLAMConfiguration();
        const yaml = YAML.parse(yamlString);
        Object.assign(instance, yaml);
        return instance;
    }

    static fromYAMLFile(filePath: string): VSLAMConfiguration {
        const instance = new VSLAMConfiguration();
        const file = fs.readFileSync(filePath, 'utf8');
        const yaml = YAML.parse(file);
        Object.assign(instance, yaml);
        return instance;
    }
}

export type CameraOptions = RadialDivisionCameraOptions | PerspectiveCameraOptions | FisheyeCameraOptions;

export interface RadialDivisionCameraOptions {
    model: 'radial_division';
    distortion: number;
}

export interface PerspectiveCameraOptions {
    model: 'perspective';
    k1: number;
    k2: number;
    p1: number;
    p2: number;
    k3: number;
}

export interface FisheyeCameraOptions {
    model: 'fisheye';
    k1: number;
    k2: number;
    k3: number;
    k4: number;
}
