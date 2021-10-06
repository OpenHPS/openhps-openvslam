#ifndef OPENHPS_OPENVSLAM_FRAME_H
#define OPENHPS_OPENVSLAM_FRAME_H

#include <nan.h>

#include <openvslam/data/frame.h>

class Frame : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        explicit Frame(openvslam::data::frame* frame);
        openvslam::data::frame* self;

    private:
        ~Frame();

        static void GetCamPose(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif