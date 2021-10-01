#ifndef OPENHPS_OPENVSLAM_FRAMEPUBLISHER_H
#define OPENHPS_OPENVSLAM_FRAMEPUBLISHER_H

#include <nan.h>
#include "system.h"
#include "Mat.h"

#include "openvslam/publish/frame_publisher.h"

class FramePublisher : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        std::shared_ptr<openvslam::publish::frame_publisher> self;

    private:
        explicit FramePublisher(const System* system);
        ~FramePublisher();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void DrawFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif