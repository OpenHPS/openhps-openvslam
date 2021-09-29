#ifndef OPENHPS_OPENVSLAM_MAPPUBLISHER_H
#define OPENHPS_OPENVSLAM_MAPPUBLISHER_H

#include <nan.h>
#include "system.h"

#include "openvslam/publish/map_publisher.h"

class MapPublisher : public Nan::ObjectWrap {
    public:
        static void NAN_INIT(v8::Local<v8::Object> exports);
        std::shared_ptr<openvslam::publish::map_publisher> self;
        
    private:
        explicit MapPublisher(const System* system);
        ~MapPublisher();

        static void NAN_NEW(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void NAN_METHOD_GET_CURRENT_CAM_POSE(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void NAN_METHOD_GET_KEYFRAMES(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif