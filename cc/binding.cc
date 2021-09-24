#include <nan.h>
#include "config.h"

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> module) {
    Config::Init(exports);
}

NODE_MODULE(openvslam, Init)
