#include "system.h"
#include "config.h"

#include <string>
#include <iostream>
#include <Eigen/Core>

#include "openvslam/data/keyframe.h"
#include "openvslam/data/landmark.h"
#include "openvslam/publish/map_publisher.h"
#include "openvslam/publish/frame_publisher.h"

Nan::Persistent<v8::Function> System::constructor;
openvslam::system* self = NULL;

System::System(const Config& config, const std::string& vocab_file_path) {
    self = new openvslam::system(config.self, vocab_file_path);
}

System::~System() {}

void System::NAN_INIT(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(NAN_NEW);
    tpl->SetClassName(Nan::New("System").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "startup", NAN_METHOD_STARTUP);
    Nan::SetPrototypeMethod(tpl, "feed_monocular_frame", NAN_METHOD_FEED_MONOCULAR_FRAME);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("System").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void System::NAN_NEW(const Nan::FunctionCallbackInfo<v8::Value>& info) {
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

void System::NAN_METHOD_STARTUP(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    bool initialize = info[0]->IsUndefined() ? true : info[0]->BooleanValue(isolate);

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->startup(initialize);
    info.GetReturnValue().Set(info.This());
}

void System::NAN_METHOD_FEED_MONOCULAR_FRAME(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    Mat* mat = Nan::ObjectWrap::Unwrap<Mat>(
        info[0]->ToObject(context).ToLocalChecked());
    double timestamp = info[1]->NumberValue(context).FromJust();
    std::shared_ptr<Eigen::Matrix4d> current_camera_pose = obj->self->feed_monocular_frame(mat->self, timestamp);

    // const size_t outSize = current_camera_pose->size();
    // v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    // for (size_t i = 0; i < outSize; ++i) {
    //     Nan::Set(outArray, i, Nan::New<v8::Number>(*(current_camera_pose->data() + i)));
    // }
    info.GetReturnValue().Set(info.This());
}

void System::NAN_METHOD_LOAD_MAP_DATABASE(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    info.GetReturnValue().Set(info.This());
}
