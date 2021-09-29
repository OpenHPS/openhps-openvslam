#ifndef OPENHPS_OPENVSLAM_CONFIG_H
#define OPENHPS_OPENVSLAM_CONFIG_H

#include <nan.h>
#include <string>
#include "openvslam/config.h"

class Config : public Nan::ObjectWrap {
    public:
        static void NAN_INIT(v8::Local<v8::Object> exports);
        std::shared_ptr<openvslam::config> self;

    private:
        explicit Config(const std::string& config_file_path);
        ~Config();

        static void NAN_NEW(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif