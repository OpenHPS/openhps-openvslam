#ifndef OPENHPS_OPENVSLAM_FRAME_H
#define OPENHPS_OPENVSLAM_FRAME_H

#include <nan.h>

#include "openvslam/data/frame.h"

class Frame : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        openvslam::frame* self;

    private:
        explicit Frame(const System* system);
        ~Frame();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCamPose(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCamPoseInv(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCamCenter(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetRotationInv(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif