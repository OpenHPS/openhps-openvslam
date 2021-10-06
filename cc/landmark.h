#ifndef OPENHPS_OPENVSLAM_LANDMARK_H
#define OPENHPS_OPENVSLAM_LANDMARK_H

#include <nan.h>

#include <openvslam/data/landmark.h>

class Landmark : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        explicit Landmark(openvslam::data::landmark* landmark);
        openvslam::data::landmark* self;

    private:
        ~Landmark();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetPosInWorld(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif