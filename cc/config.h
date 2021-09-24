#ifndef OPENHPS_OPENVSLAM_CONFIG_H
#define OPENHPS_OPENVSLAM_CONFIG_H

#include <nan.h>
#include "openvslam/config.h"

class Config : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);

    private:
        explicit Config(const std::string& config_file_path);
        ~Config();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
        openvslam::config* cfg;
};

#endif