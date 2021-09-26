#ifndef OPENHPS_OPENVSLAM_FRAMEPUBLISHER_H
#define OPENHPS_OPENVSLAM_FRAMEPUBLISHER_H

#include <nan.h>
#include "system.h"

#include "openvslam/publish/frame_publisher.h"

class FramePublisher : public Nan::ObjectWrap {
    public:
        static void NAN_INIT(v8::Local<v8::Object> exports);
        std::shared_ptr<openvslam::publish::frame_publisher> publisher;

    private:
        explicit FramePublisher(const System* system);
        ~FramePublisher();

        static void NAN_NEW(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif