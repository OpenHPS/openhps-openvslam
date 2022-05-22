#ifndef OPENHPS_OPENVSLAM_PANGOLIN_VIEWER_H
#define OPENHPS_OPENVSLAM_PANGOLIN_VIEWER_H

#include <nan.h>
#include "../system.h"

#include <yaml-cpp/yaml.h>
#include <pangolin_viewer/viewer.h>

class Viewer : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        std::shared_ptr<pangolin_viewer::viewer> self;

    private:
        explicit Viewer(stella_vslam::system* system, const std::string& url);
        ~Viewer();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void Run(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void Terminate(const Nan::FunctionCallbackInfo<v8::Value>& info);

        static Nan::Persistent<v8::Function> constructor;
};

#endif