const log = require('npmlog')
const path = require('path')
const child_process = require('child_process')

function resolvePath(filePath, file) {
  if (!filePath) {
    return undefined
  }
  return (file ? path.resolve(filePath, file) : path.resolve(filePath)).replace(/\\/g, '/')
}


const opencvIncludeDir = resolvePath(process.env.OPENCV_INCLUDE_DIR)
const openvslamIncludeDir = resolvePath(process.env.OPENVSLAM_INCLUDE_DIR)
const opencvLibDir = resolvePath(process.env.OPENCV_LIB_DIR)
const openvslamLibDir = resolvePath(process.env.OPENVSLAM_LIB_DIR)

const includes = [
  opencvIncludeDir,
  openvslamIncludeDir,
  path.join(openvslamIncludeDir,"../3rd", "json", "include"),
  path.join(openvslamIncludeDir,"../3rd", "spdlog", "include"),
]

const libraries = [
  "-L" + opencvLibDir,
  "-L" + openvslamLibDir,
  "-Wl,-rpath=" + openvslamLibDir,
  "-lopenvslam",
  "-lsocket_publisher",
]

if (includes.length < 2 || libraries.length < 2) {
  return log.error('install', 'test')
}

log.info('install', `using following includes: ${includes.join("\n")}\n`)
log.info('install', `using following libraries: ${libraries.join("\n")}\n`)

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