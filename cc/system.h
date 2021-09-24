#ifndef OPENHPS_OPENVSLAM_SYSTEM_H
#define OPENHPS_OPENVSLAM_SYSTEM_H

#include <nan.h>
#include "config.h"
#include "openvslam/system.h"

class System : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);

    private:
        explicit System(const config& cfg, const std::string& vocab_file_path);
        ~System();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif