#ifndef OPENHPS_OPENVSLAM_SOCKET_PUBLISHER_H
#define OPENHPS_OPENVSLAM_SOCKET_PUBLISHER_H

#include <nan.h>
#include "../system.h"

#include <yaml-cpp/yaml.h>
#include <socket_publisher/publisher.h>

class Publisher : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        std::shared_ptr<socket_publisher::publisher> self;
        
    private:
        explicit Publisher(stella_vslam::system* system, const std::string& url);
        ~Publisher();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void Run(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void Terminate(const Nan::FunctionCallbackInfo<v8::Value>& info);

        static Nan::Persistent<v8::Function> constructor;
};

#endif