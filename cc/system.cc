#include "system.h"
#include "config.h"
#include "frame_publisher.h"
#include "map_publisher.h"

#include <string>
#include <iostream>
#include <Eigen/Core>

Nan::Persistent<v8::Function> System::constructor;
stella_vslam::system* self = NULL;
cv::Mat mask = cv::Mat{};

System::System(const Config& config, const std::string& vocab_file_path) {
    self = new stella_vslam::system(config.self, vocab_file_path);
}

System::~System() {}

void System::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("System").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "startup", Startup);
    Nan::SetPrototypeMethod(tpl, "getFramePublisher", GetFramePublisher);
    Nan::SetPrototypeMethod(tpl, "getMapPublisher", GetMapPublisher);
    Nan::SetPrototypeMethod(tpl, "feedMonocularFrame", FeedMonocularFrame);
    Nan::SetPrototypeMethod(tpl, "feedStereoFrame", FeedStereoFrame);
    Nan::SetPrototypeMethod(tpl, "feedRGBDFrame", FeedRGBDFrame);
    Nan::SetPrototypeMethod(tpl, "loadMap", LoadMapDatabase);
    Nan::SetPrototypeMethod(tpl, "saveMap", SaveMapDatabase);
    Nan::SetPrototypeMethod(tpl, "enableMapping", EnableMappingModule);
    Nan::SetPrototypeMethod(tpl, "reset", Reset);
    Nan::SetPrototypeMethod(tpl, "terminate", Terminate);
    Nan::SetPrototypeMethod(tpl, "disableMapping", DisableMappingModule);
    Nan::SetPrototypeMethod(tpl, "shutdown", Shutdown);
    Nan::SetPrototypeMethod(tpl, "relocalizeByPose", RelocalizeByPose);
    Nan::SetAccessor(tpl->InstanceTemplate(), Nan::New("config").ToLocalChecked(), GetConfig);

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

void System::GetFramePublisher(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    info.GetReturnValue().Set(FramePublisher::NewInstance(obj));
}

void System::GetMapPublisher(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    info.GetReturnValue().Set(MapPublisher::NewInstance(obj));
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
    cv::Mat mask = info[2]->IsUndefined() ? obj->mask : 
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
    cv::Mat mask = info[3]->IsUndefined() ? obj->mask : 
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
    cv::Mat mask = info[3]->IsUndefined() ? obj->mask : 
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

void System::GetConfig(v8::Local<v8::String> property, const Nan::PropertyCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    info.GetReturnValue().Set(Nan::New(obj->config));
}

void System::RelocalizeByPose(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    // v8::Isolate *isolate = info.GetIsolate();
    // v8::Local<v8::Context> context = isolate->GetCurrentContext();

    // System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    // stella_vslam::Mat44_t* mat = Nan::ObjectWrap::Unwrap<stella_vslam::Mat44_t>(
    //     info[0]->ToObject(context).ToLocalChecked());
    // obj->self->relocalize_by_pose(*mat);
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

void System::Terminate(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->request_terminate();
}

void System::Reset(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    System* obj = ObjectWrap::Unwrap<System>(info.Holder());
    obj->self->request_reset();
}