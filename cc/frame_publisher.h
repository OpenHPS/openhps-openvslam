#ifndef OPENHPS_OPENVSLAM_FRAMEPUBLISHER_H
#define OPENHPS_OPENVSLAM_FRAMEPUBLISHER_H

#include <nan.h>
#include "system.h"
#include <Mat.h>

#include <stella_vslam/system.h>
#include <stella_vslam/publish/frame_publisher.h>

class FramePublisher : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        explicit FramePublisher(const stella_vslam::system* system);
        static v8::Local<v8::Object> NewInstance(System* system);

        std::shared_ptr<stella_vslam::publish::frame_publisher> self;

    private:
        ~FramePublisher();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void DrawFrame(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif