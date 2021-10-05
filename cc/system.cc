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

void System::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("System").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "startup", Startup);
    Nan::SetPrototypeMethod(tpl, "feedMonocularFrame", FeedMonocularFrame);
    Nan::SetPrototypeMethod(tpl, "feedStereoFrame", FeedStereoFrame);
    Nan::SetPrototypeMethod(tpl, "feedRGBDFrame", FeedRGBDFrame);
    Nan::SetPrototypeMethod(tpl, "loadMap", LoadMapDatabase);
    Nan::SetPrototypeMethod(tpl, "saveMap", SaveMapDatabase);
    Nan::SetPrototypeMethod(tpl, "enableMapping", EnableMappingModule);
    Nan::SetPrototypeMethod(tpl, "disableMapping", DisableMappingModule);
    Nan::SetPrototypeMethod(tpl, "shutdown", Shutdown);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("System").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void System::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        Config* cfg = Nan::ObjectWrap::Unwrap<Config>(
            info[0]->ToObject(context).ToLocalChecked());
        v8::String::Utf8Value vocab_file_path(isolate, info[1]);
        System* obj = new System(*cfg, std::string(*vocab_file_path));
        obj->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        // Invoked as plain function
        const int argc = 2;
        v8::Local<v8::Value> argv[argc] = {info[0], info[1]};
        v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
        info.GetReturnValue().Set(
            cons->NewInstance(context, argc, argv).ToLocalChecked());
    }
}

void System::Startup(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    bool initialize = info[0]->IsUndefined() ? true : info[0]->BooleanValue(isolate);

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->startup(initialize);
}

void System::FeedMonocularFrame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    Mat* image = Nan::ObjectWrap::Unwrap<Mat>(
        info[0]->ToObject(context).ToLocalChecked());
    double timestamp = info[1]->NumberValue(context).FromJust();
    cv::Mat mask = info[2]->IsUndefined() ? cv::Mat{} : 
        Nan::ObjectWrap::Unwrap<Mat>(
            info[2]->ToObject(context).ToLocalChecked())->self;
    obj->self->feed_monocular_frame(image->self, timestamp, mask);
}

void System::FeedStereoFrame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    Mat* left_image = Nan::ObjectWrap::Unwrap<Mat>(
        info[0]->ToObject(context).ToLocalChecked());
    Mat* right_image = Nan::ObjectWrap::Unwrap<Mat>(
        info[1]->ToObject(context).ToLocalChecked());
    double timestamp = info[2]->NumberValue(context).FromJust();
    cv::Mat mask = info[3]->IsUndefined() ? cv::Mat{} : 
        Nan::ObjectWrap::Unwrap<Mat>(
            info[3]->ToObject(context).ToLocalChecked())->self;
    obj->self->feed_stereo_frame(left_image->self, right_image->self, timestamp, mask);
}

void System::FeedRGBDFrame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    Mat* rgb_image = Nan::ObjectWrap::Unwrap<Mat>(
        info[0]->ToObject(context).ToLocalChecked());
    Mat* depth_image = Nan::ObjectWrap::Unwrap<Mat>(
        info[1]->ToObject(context).ToLocalChecked());
    double timestamp = info[2]->NumberValue(context).FromJust();
    cv::Mat mask = info[3]->IsUndefined() ? cv::Mat{} : 
        Nan::ObjectWrap::Unwrap<Mat>(
            info[3]->ToObject(context).ToLocalChecked())->self;
    obj->self->feed_RGBD_frame(rgb_image->self, depth_image->self, timestamp, mask);
}

void System::LoadMapDatabase(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    v8::String::Utf8Value path(isolate, info[0]);
    obj->self->load_map_database(std::string(*path));
}

void System::SaveMapDatabase(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();

    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    v8::String::Utf8Value path(isolate, info[0]);
    obj->self->save_map_database(std::string(*path));
}

void System::EnableMappingModule(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->enable_mapping_module();
}

void System::DisableMappingModule(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->disable_mapping_module();
}

void System::Shutdown(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->shutdown();
}