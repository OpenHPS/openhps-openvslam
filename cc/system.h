#ifndef OPENHPS_OPENVSLAM_SYSTEM_H
#define OPENHPS_OPENVSLAM_SYSTEM_H

#include <nan.h>
#include "config.h"
#include <opencv2/core.hpp>
#include "openvslam/system.h"
#include "Mat.h"

class System : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);

    private:
        explicit System(const Config& cfg, const std::string& vocab_file_path);
        ~System();
        openvslam::system* SLAM;

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void startup(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void feed_monocular_frame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void get_current_cam_pose(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif