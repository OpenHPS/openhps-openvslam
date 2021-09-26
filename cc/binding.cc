#include <nan.h>
#include "config.h"
#include "system.h"

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
    Config::Init(exports);
    System::Init(exports);
}

NODE_MODULE(openvslam, Init)
