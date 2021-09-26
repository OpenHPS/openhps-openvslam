#include <nan.h>
#include "config.h"
#include "system.h"
#include "frame_publisher.h"
#include "map_publisher.h"

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
    Config::NAN_INIT(exports);
    System::NAN_INIT(exports);
    MapPublisher::NAN_INIT(exports);
    FramePublisher::NAN_INIT(exports);
}

NODE_MODULE(openvslam, Init)
