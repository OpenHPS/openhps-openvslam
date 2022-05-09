#ifndef OPENHPS_OPENVSLAM_KEYFRAME_H
#define OPENHPS_OPENVSLAM_KEYFRAME_H

#include <nan.h>

#include <stella_vslam/data/keyframe.h>

class KeyFrame : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        explicit KeyFrame();
        static v8::Local<v8::Object> NewInstance(std::shared_ptr<stella_vslam::data::keyframe> native);
        std::shared_ptr<stella_vslam::data::keyframe> self;

    private:
        ~KeyFrame();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void ToJSON(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif