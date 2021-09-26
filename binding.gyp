{
    "targets": [
		{
			"target_name": "native",
			"include_dirs" : [
				"<!@(node ./install/parseEnv.js OPENVSLAM_INCLUDES)",
				"cc",
				"<!(node -e \"require('nan')\")",
				"<!(node -e \"require('native-node-utils')\")",
				"/usr/local/include/eigen3",
        		"/usr/include/eigen3",
				"/usr/local/include/g2o",
				"/usr/local/include/",
				"/usr/include/",
        		"/usr/include/g2o",
				"node_modules/opencv4nodejs/cc",
				"node_modules/opencv4nodejs/cc/core"
			],
			"libraries": [
				"<!@(node ./install/parseEnv.js OPENVSLAM_LIBRARIES)",
			],
			"sources": [
				"cc/binding.cc",
				"cc/config.cc",
				"cc/system.cc",
				"cc/frame_publisher.cc",
				"cc/map_publisher.cc"
			],
			"cflags" : [
				"-std=c++11",
				"-Wno-unused-result"
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
