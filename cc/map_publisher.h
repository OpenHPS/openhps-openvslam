#ifndef OPENHPS_OPENVSLAM_MAPPUBLISHER_H
#define OPENHPS_OPENVSLAM_MAPPUBLISHER_H

#include <nan.h>
#include "system.h"
#include "landmark.h"
#include "keyframe.h"

#include <openvslam/system.h>
#include <openvslam/data/keyframe.h>
#include <openvslam/publish/map_publisher.h>

class MapPublisher : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        explicit MapPublisher(const openvslam::system* system);
        static v8::Local<v8::Object> NewInstance(System* system);

        std::shared_ptr<openvslam::publish::map_publisher> self;
        
    private:
        ~MapPublisher();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCurrentCamPose(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetKeyFrames(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetAllLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetLocalLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif