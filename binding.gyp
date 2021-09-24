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
        		"/usr/include/g2o"
			],
			"libraries": [
				"<!@(node ./install/parseEnv.js OPENVSLAM_LIBRARIES)"
			],
			"sources": [
				"cc/binding.cc",
				"cc/config.cc"
			],
			"cflags" : [
				"-std=c++11"
			],
			"cflags!" : [
				"-fno-exceptions"
			],
			"cflags_cc!": [
				"-fno-rtti",
				"-fno-exceptions"
			],
		}
    ]
}
