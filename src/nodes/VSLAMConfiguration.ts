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
     * @returns {string} YAML output string
     */
    toYAML(): string {
        return YAML.stringify(this);
    }

    static fromYAML(yamlString: string): VSLAMConfiguration {
        return VSLAMConfiguration.fromParsedYAML(YAML.parse(yamlString));
    }

    static fromYAMLFile(filePath: string): VSLAMConfiguration {
        const file = fs.readFileSync(filePath, 'utf8');
        return VSLAMConfiguration.fromParsedYAML(YAML.parse(file));
    }

    private static fromParsedYAML(yaml: any): VSLAMConfiguration {
        const instance = new VSLAMConfiguration();
        if (yaml === null || typeof yaml !== 'object') {
            return instance;
        }
        // Copy the properties without letting a malicious document alter the
        // prototype chain (a `__proto__` key) of the instance
        for (const key of Object.keys(yaml)) {
            if (key === '__proto__') {
                continue;
            }
            Object.defineProperty(instance, key, {
                value: yaml[key],
                writable: true,
                enumerable: true,
                configurable: true,
            });
        }
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
