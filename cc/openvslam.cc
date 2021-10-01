#include <nan.h>
#include "config.h"
#include "system.h"
#include "frame_publisher.h"
#include "map_publisher.h"

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
    Config::Init(exports);
    System::Init(exports);
    MapPublisher::Init(exports);
    FramePublisher::Init(exports);
}

NODE_MODULE(openvslam, Init)
