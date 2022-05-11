import { CameraObject } from '@openhps/video';
import * as YAML from 'yaml';
import * as fs from 'fs';

export class VSLAMConfiguration {
    /**
     * Camera object
     */
    camera:
        | CameraObject
        | ({
              /**
               * It is used by the camera database to identify the camera.
               */
              name?: string;
              setup?: 'monocular' | 'stereo' | 'RGBD';
              /**
               * Focal length (pixel X)
               */
              fx?: number;
              /**
               * Focal length (pixel Y)
               */
              fy?: number;
              /**
               * Principal point (pixel X)
               */
              cx?: number;
              /**
               * Principal point (pixel Y)
               */
              cy?: number;
              /**
               * Framerate of input images
               */
              fps: number;
              cols?: number;
              rows?: number;
              color_order?: 'Gray' | 'RGB' | 'RGBA' | 'BGR' | 'BGRA';
              focal_x_baseline?: number;
          } & CameraOptions);
    feature?: {
        /**
         * Scale of the image pyramid
         */
        scale_factor?: number;
        /**
         * Number of levels of in the image pyramid
         */
        num_levels?: number;
        /**
         * FAST threshold for try first
         */
        ini_fast_threshold?: number;
        /**
         * FAST threshold for try second time
         */
        min_fast_threshold?: number;
    };
    tracking?: {
        /**
         * Maximum number of feature points per frame to be used for SLAM.
         */
        max_num_keypoints?: number;
        /**
         * Maximum number of feature points per frame to be used for Initialization. It is only used for monocular camera models.
         */
        ini_max_num_keypoints?: number;
        /**
         * The ratio used to determine the depth threshold.
         */
        depth_threshold?: number;
        /**
         * The ratio used to convert depth image pixel values to distance.
         */
        depthmap_factor?: number;
        /**
         * Maximum distance threshold (in meters) where close keyframes could be found when doing a relocalization by pose.
         */
        reloc_distance_threshold?: number;
        /**
         * Maximum angle threshold (in radians) between given pose and close keyframes when doing a relocalization by pose.
         */
        reloc_angle_threshold?: number;
        /**
         * If true, automatically try to relocalize when lost.
         */
        enable_auto_relocalization?: boolean;
        /**
         * If true, use robust_matcher for relocalization request.
         */
        use_robust_matcher_for_relocalization_request?: boolean;
    };
    mapping?: {
        /**
         * For two frames of baseline below the threshold, no triangulation will be performed. In the monocular case, the scale is indefinite, so relative values are recommended. Either baseline_dist_thr or this one should be specified. If not specified, baseline_dist_thr_ratio will be used.
         */
        baseline_dist_thr_ratio?: number;
        /**
         * For two frames of baseline below the threshold, no triangulation will be performed.
         */
        baseline_dist_thr?: number;
        redundant_obs_ratio_thr?: number;
    };
    loopDetector?: {
        /**
         * Flag which indicates the loop detector is enabled or not.
         */
        enabled?: boolean;
        /**
         * The threshold of the number of mutual matches after the Sim3 estimation
         */
        num_final_matches_threshold?: number;
        /**
         * The threshold of the continuity of continuously detected keyframe set
         */
        min_continuity?: number;
    };
    initializer?: {
        /**
         * Minimum number of triangulated points
         */
        num_min_triangulated_pts?: number;
    };
    stereoRectifier?: {
        /**
         * Camera model type before rectification
         */
        model: string;
    };
    bowDatabase?: {
        reject_by_graph_distance?: any;
        loop_min_distance_on_graph?: number;
    };

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
