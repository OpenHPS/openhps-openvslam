{
    "targets": [
		{
			"target_name": "openvslam",
			"include_dirs" : [
				"<!@(node ./install/parseEnv.js OPENVSLAM_INCLUDES)",
				"cc",
				"<!(node -e \"require('nan')\")",
				"<!(node -e \"require('native-node-utils')\")",
			],
			"libraries": [
				"<!@(node ./install/parseEnv.js OPENVSLAM_LIBRARIES)",
			],
			"sources": [
				"cc/config.cc",
				"cc/system.cc",
				"cc/frame_publisher.cc",
				"cc/map_publisher.cc",
				"cc/landmark.cc",
				"cc/keyframe.cc",
				"cc/graph_node.cc",
				"cc/openvslam.cc",
			],
			"cflags" : [
				"-std=c++11",
				"-Wno-unused-result",
				"-Wno-unused-result",
				"-Wno-deprecated-declarations",
				"-Wno-reorder"
			],
			"cflags!" : [
				"-fno-exceptions",
			],
			"cflags_cc!": [
				"-fno-rtti",
				"-fno-exceptions"
			],
		}
    ]
}
