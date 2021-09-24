#include "config.h"

#include <iostream>

Nan::Persistent<v8::Function> Config::constructor;
openvslam::config* cfg = NULL;

Config::Config(const std::string& config_file_path) {
    std::cout<<config_file_path<<std::endl;
    openvslam::config test = openvslam::config(config_file_path);
    std::cout<<test<<std::endl;
}

Config::~Config() {}

void Config::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("Config").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    // Nan::SetPrototypeMethod(tpl, "value", GetValue);
    // Nan::SetPrototypeMethod(tpl, "plusOne", PlusOne);
    // Nan::SetPrototypeMethod(tpl, "multiply", Multiply);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("Config").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Config::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor: `new Config(...)`
        v8::String::Utf8Value config_file_path(isolate, info[0]);
        Config* obj = new Config(std::string(*config_file_path));
        obj->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        // Invoked as plain function `Config(...)`, turn into construct call.
        const int argc = 1;
        v8::Local<v8::Value> argv[argc] = {info[0]};
        v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
        info.GetReturnValue().Set(
            cons->NewInstance(context, argc, argv).ToLocalChecked());
    }
}

// void Config::GetValue(const Nan::FunctionCallbackInfo<v8::Value>& info) {
//     Config* obj = ObjectWrap::Unwrap<Config>(info.Holder());
//     info.GetReturnValue().Set(Nan::New(obj->value_));
// }

// void Config::PlusOne(const Nan::FunctionCallbackInfo<v8::Value>& info) {
//     Config* obj = ObjectWrap::Unwrap<Config>(info.Holder());
//     obj->value_ += 1;
//     info.GetReturnValue().Set(Nan::New(obj->value_));
// }
