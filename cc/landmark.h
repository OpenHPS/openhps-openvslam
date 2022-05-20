#ifndef OPENHPS_OPENVSLAM_LANDMARK_H
#define OPENHPS_OPENVSLAM_LANDMARK_H

#include <nan.h>

#include <stella_vslam/data/landmark.h>

class Landmark : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        explicit Landmark();
        static v8::Local<v8::Object> NewInstance(std::shared_ptr<stella_vslam::data::landmark> native);
        std::shared_ptr<stella_vslam::data::landmark> self;

    private:
        ~Landmark();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetPosInWorld(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void ToJSON(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetId(v8::Local<v8::String> property, const Nan::PropertyCallbackInfo<v8::Value>& info);

        static Nan::Persistent<v8::Function> constructor;
};

#endif