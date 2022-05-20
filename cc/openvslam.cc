#include <nan.h>
#include "config.h"
#include "system.h"
#include "frame_publisher.h"
#include "map_publisher.h"
#include "landmark.h"
#include "keyframe.h"
#include <spdlog/spdlog.h>

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
    spdlog::set_level(spdlog::level::debug);

    Config::Init(exports);
    System::Init(exports);
    MapPublisher::Init(exports);
    FramePublisher::Init(exports);
    Landmark::Init(exports);
    KeyFrame::Init(exports);
}

NODE_MODULE(openvslam, Init)
