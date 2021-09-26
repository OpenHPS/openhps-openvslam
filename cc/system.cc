#include "system.h"
#include "config.h"

#include <string>
#include <iostream>
#include <Eigen/Core>

#include "openvslam/publish/map_publisher.h"

Nan::Persistent<v8::Function> System::constructor;
openvslam::system* SLAM = NULL;

System::System(const Config& config, const std::string& vocab_file_path) {
    SLAM = new openvslam::system(config.cfg, vocab_file_path);
}

System::~System() {}

void System::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("System").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "startup", startup);
    Nan::SetPrototypeMethod(tpl, "feed_monocular_frame", feed_monocular_frame);
    Nan::SetPrototypeMethod(tpl, "get_current_cam_pose", get_current_cam_pose);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("System").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void System::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor: `new System(...)`
        Config* cfg = Nan::ObjectWrap::Unwrap<Config>(
            info[0]->ToObject(context).ToLocalChecked());
        v8::String::Utf8Value vocab_file_path(isolate, info[1]);
        System* obj = new System(*cfg, std::string(*vocab_file_path));
        obj->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        // Invoked as plain function `System(...)`, turn into construct call.
        const int argc = 2;
        v8::Local<v8::Value> argv[argc] = {info[0], info[1]};
        v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
        info.GetReturnValue().Set(
            cons->NewInstance(context, argc, argv).ToLocalChecked());
    }
}

void System::startup(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->SLAM->startup();
    
    
    info.GetReturnValue().Set(info.This());
}

void System::feed_monocular_frame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    Mat* mat = Nan::ObjectWrap::Unwrap<Mat>(
        info[0]->ToObject(context).ToLocalChecked());
    double timestamp = info[1]->NumberValue(context).FromJust();
    obj->SLAM->feed_monocular_frame(mat->self, timestamp);
    info.GetReturnValue().Set(info.This());
}

void System::get_current_cam_pose(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    std::shared_ptr<openvslam::publish::map_publisher> map_publisher = obj->SLAM->get_map_publisher();
    Eigen::Matrix4d pose = map_publisher->get_current_cam_pose();
    
    const size_t outSize = pose.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    for (size_t i = 0; i < outSize; ++i) {
        Nan::Set(outArray, i, Nan::New<v8::Number>(*(pose.data() + i)));
    }
    std::cout<<std::endl;
    info.GetReturnValue().Set(outArray);
}
