#ifndef OPENHPS_OPENVSLAM_SYSTEM_H
#define OPENHPS_OPENVSLAM_SYSTEM_H

#include <nan.h>
#include "config.h"

#include <opencv2/core.hpp>
#include <stella_vslam/system.h>
#include <stella_vslam/config.h>
#include "Mat.h"

class System : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        stella_vslam::system* self;

    private:
        explicit System(const Config& cfg, const std::string& vocab_file_path);
        ~System();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void Startup(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetMapPublisher(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetFramePublisher(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void CreateMonocularFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void FeedMonocularFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void CreateStereoFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void FeedStereoFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void CreateRGBDFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void FeedRGBDFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void LoadMapDatabase(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void SaveMapDatabase(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void EnableMappingModule(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void DisableMappingModule(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void RequestTerminate(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void Shutdown(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void RelocalizeByPose(const Nan::FunctionCallbackInfo<v8::Value>& info);

        static Nan::Persistent<v8::Function> constructor;
};

#endif