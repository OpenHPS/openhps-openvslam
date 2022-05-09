const log = require('npmlog')
const path = require('path')
const child_process = require('child_process')
const { OpenCVBuilder } = require('@u4/opencv-build')

function resolvePath(filePath, file) {
  if (!filePath) {
    return undefined
  }
  return (file ? path.resolve(filePath, file) : path.resolve(filePath)).replace(/\\/g, '/')
}


const OPENCV_INCLUDE_DIR = resolvePath(process.env.OPENCV_INCLUDE_DIR)
const OPENVSLAM_INCLUDE_DIR = resolvePath(process.env.OPENVSLAM_INCLUDE_DIR)
const OPENCV_LIB_DIR = resolvePath(process.env.OPENCV_LIB_DIR)
const OPENVSLAM_LIB_DIR = resolvePath(process.env.OPENVSLAM_LIB_DIR)

const includes = [
  OPENCV_INCLUDE_DIR,
  OPENVSLAM_INCLUDE_DIR,
  path.join(OPENVSLAM_INCLUDE_DIR,"../3rd", "json", "include"),
  path.join(OPENVSLAM_INCLUDE_DIR,"../3rd", "spdlog", "include"),
  path.join(OPENVSLAM_INCLUDE_DIR,"../3rd", "FBoW", "include"),
  "/usr/local/include/eigen3",
  "/usr/include/eigen3",
  "/usr/local/include/g2o",
  "/usr/local/include/g2o",
  "/usr/local/include/",
  "/usr/include/",
  "/usr/include/g2o",
  "node_modules/@u4/opencv4nodejs/cc",
  "node_modules/@u4/opencv4nodejs/cc/core"
]

const opencvBuilder = new OpenCVBuilder();
const libraries = [
  "-L" + OPENCV_LIB_DIR,
  ...opencvBuilder.getLibs.getLibs()
    .filter(lib => lib.libPath).map(lib => "-lopencv_" + lib.opencvModule),
  "-Wl,-rpath=" + OPENCV_LIB_DIR,
  "-L" + OPENVSLAM_LIB_DIR,
  "-Wl,-rpath=" + OPENVSLAM_LIB_DIR,
  "-lstella_vslam"
]

log.info('install', `using following includes: \n${includes.join("\n")}\n`)
log.info('install', `using following libraries: \n${libraries.join("\n")}\n`)

process.env['OPENVSLAM_INCLUDES'] = includes.join('\n')
process.env['OPENVSLAM_LIBRARIES'] = libraries.join('\n')

const nodegypCmd = 'node-gyp rebuild'

log.info('install', `spawning node gyp process: ${nodegypCmd}`)
const child = child_process.exec(nodegypCmd, { maxBuffer: Infinity }, function(err, stdout, stderr) {
  const _err = err || stderr
  if (_err) log.error(_err)
})
child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)
