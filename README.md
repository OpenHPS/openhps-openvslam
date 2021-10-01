<h1 align="center">
  <img alt="OpenHPS" src="https://openhps.org/images/logo_text-512.png" width="40%" /><br />
  @openhps/openvslam
</h1>
<p align="center">
    <a href="https://ci.mvdw-software.com/job/openhps-openvslam/" target="_blank">
        <img alt="Build Status" src="https://ci.mvdw-software.com/job/openhps-openvslam/job/dev/badge/icon">
    </a>
    <a href="https://ci.mvdw-software.com/view/OpenHPS/job/openhps-openvslam/job/dev/lastCompletedBuild/testReport" target="_blank">
        <img alt="Tests" src="https://img.shields.io/jenkins/tests?compact_message&jobUrl=https%3A%2F%2Fci.mvdw-software.com%2Fview%2FOpenHPS%2Fjob%2Fopenhps-openvslam%2Fjob%2Fdev">
    </a>
    <a href="https://ci.mvdw-software.com/view/OpenHPS/job/openhps-openvslam/job/dev/lastCompletedBuild/cobertura/" target="_blank">
        <img alt="Code coverage" src="https://img.shields.io/jenkins/coverage/cobertura?jobUrl=https%3A%2F%2Fci.mvdw-software.com%2Fview%2FOpenHPS%2Fjob%2Fopenhps-openvslam%2Fjob%2Fdev%2F">
    </a>
    <a href="https://codeclimate.com/github/OpenHPS/openhps-openvslam/" target="_blank">
        <img alt="Maintainability" src="https://img.shields.io/codeclimate/maintainability/OpenHPS/openhps-openvslam">
    </a>
</p>

<h3 align="center">
    <a href="https://github.com/OpenHPS/openhps-core">@openhps/core</a> &mdash; <a href="https://openhps.org/docs/openvslam">API</a>
</h3>

<br />
@openhps/openvslam adds bindings and OpenHPS abstracts for [OpenVSLAM](https://openvslam-community.readthedocs.io/en/latest/). It supports [@openhps/opencv](https://github.com/OpenHPS/openhps-opencv) for video processing before sending it to OpenVSLAM. This module will create C++ bindings to OpenVSLAM and supports monocular and stereo SLAM (based on ORB-SLAM2).

## Installation
1. Install OpenCV 4.X-4.3.X (4.4.0 or higher is not supported)
2. Install OpenVSLAM according to the instructions on https://openvslam-community.readthedocs.io/en/latest/
    *We have a docker container for the unit tests that you can investigate.*
3. You will need to declare the following environment variables before installing this NPM module
    - ```OPENCV_LIB_DIR```: Library directory of OpenCV
    - ```OPENCV_INCLUDE_DIR```: Include directory of OpenCV
    - ```OPENVSLAM_LIB_DIR```: OpenVSLAM library directory
    - ```OPENVSLAM_INCLUDE_DIR```: OpenVSLAM include directory
4. Install @openhps/core if you have not installed it already
5.  ```bash
    npm install @openhps/openvslam --save
    ```

## Usage

### Basic Usage
OpenVSLAM uses a map database, vocabulary and configuration YAML file to start the mapping and/or localization. Basic usage
allows you to specify the locations of these files to start the processing.

```typescript
import { ModelBuilder } from '@openhps/core';
import { VideoSource } from '@openhps/opencv';
import { VSLAMProcessingNode } from '@openhps/openvslam';

ModelBuilder.create()
    .from(new VideoSource({

    }))
    .via(new VSLAMProcessingNode({
        config: "/path/to/config.yaml",         // OpenVSLAM camera configuration
        mapping: true,                          // Enable to disable the mapping
        mapDatabaseFile: "/path/to/map.msg",    // Map database file in MessagePack format
        vocabularyFile: "/path/to/vocab.fbow",  // OpenVSLAM vocabulary file
        persistMapping: true,                   // Persist any changes to the map data file
    }))
    .to(new CallbackSinkNode(frame => {

    }))
    .build();
```

## Contributors
The framework is open source and is mainly developed by PhD Student Maxim Van de Wynckel as part of his research towards *Hybrid Positioning and Implicit Human-Computer Interaction* under the supervision of Prof. Dr. Beat Signer.

## Contributing
Use of OpenHPS, contributions and feedback is highly appreciated. Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## License
Copyright (C) 2019-2021 Maxim Van de Wynckel & Vrije Universiteit Brussel

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.