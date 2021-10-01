#ifndef OPENHPS_OPENVSLAM_MAPPUBLISHER_H
#define OPENHPS_OPENVSLAM_MAPPUBLISHER_H

#include <nan.h>
#include "system.h"

#include "openvslam/publish/map_publisher.h"

class MapPublisher : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        std::shared_ptr<openvslam::publish::map_publisher> self;
        
    private:
        explicit MapPublisher(const System* system);
        ~MapPublisher();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCurrentCamPose(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetKeyFrames(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif