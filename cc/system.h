#ifndef OPENHPS_OPENVSLAM_SYSTEM_H
#define OPENHPS_OPENVSLAM_SYSTEM_H

#include <nan.h>
#include "config.h"
#include <opencv2/core.hpp>
#include "openvslam/system.h"
#include "openvslam/config.h"
#include "Mat.h"

class System : public Nan::ObjectWrap {
    public:
        static void NAN_INIT(v8::Local<v8::Object> exports);
        openvslam::system* SLAM;

    private:
        explicit System(const Config& cfg, const std::string& vocab_file_path);
        ~System();

        static void NAN_NEW(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void NAN_METHOD_STARTUP(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void NAN_METHOD_FEED_MONOCULAR_FRAME(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void NAN_METHOD_LOAD_MAP_DATABASE(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif