#include "map_publisher.h"

#include <string>
#include <iostream>

Nan::Persistent<v8::Function> MapPublisher::constructor;

MapPublisher::MapPublisher(const openvslam::system* system) {
    self = system->get_map_publisher();
}

MapPublisher::~MapPublisher() {}

void MapPublisher::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("MapPublisher").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "getCurrentCamPose", GetCurrentCamPose);
    Nan::SetPrototypeMethod(tpl, "getKeyFrames", GetKeyFrames);
    Nan::SetPrototypeMethod(tpl, "getAllLandmarks", GetAllLandmarks);
    Nan::SetPrototypeMethod(tpl, "getLocalLandmarks", GetLocalLandmarks);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("MapPublisher").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void MapPublisher::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        System* system = Nan::ObjectWrap::Unwrap<System>(
            info[0]->ToObject(context).ToLocalChecked());
        MapPublisher* obj = new MapPublisher(system->self);
        obj->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        // Invoked as plain function
        const int argc = 1;
        v8::Local<v8::Value> argv[argc] = {info[0]};
        v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
        info.GetReturnValue().Set(
            cons->NewInstance(context, argc, argv).ToLocalChecked());
    }
}

v8::Local<v8::Object> MapPublisher::NewInstance(System* system) {
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    const int argc = 1;
    v8::Local<v8::Value> argv[1] = {system->handle()};
    return Nan::NewInstance(cons, argc, argv).ToLocalChecked();
}

void MapPublisher::GetCurrentCamPose(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    MapPublisher* obj = ObjectWrap::Unwrap<MapPublisher>(info.Holder());
    Eigen::Matrix4d current_camera_pose = obj->self->get_current_cam_pose();
    
    const size_t outSize = current_camera_pose.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    for (size_t i = 0; i < outSize; ++i) {
        Nan::Set(outArray, i, Nan::New<v8::Number>(*(current_camera_pose.data() + i)));
    }
    info.GetReturnValue().Set(outArray);
}

void MapPublisher::GetKeyFrames(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    MapPublisher* obj = ObjectWrap::Unwrap<MapPublisher>(info.Holder());
    std::vector<openvslam::data::keyframe*> keyframes;
    obj->self->get_keyframes(keyframes);
    std::cout<<keyframes.size()<<std::endl;
    v8::Local<v8::Object> keyframe = Nan::New<v8::Object>();
    info.GetReturnValue().Set(keyframe);
}

void MapPublisher::GetAllLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    MapPublisher* obj = ObjectWrap::Unwrap<MapPublisher>(info.Holder());
    std::vector<openvslam::data::landmark*> allLandmarks;
    std::set<openvslam::data::landmark*> localLandmarks;
    obj->self->get_landmarks(allLandmarks, localLandmarks);
}

void MapPublisher::GetLocalLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    MapPublisher* obj = ObjectWrap::Unwrap<MapPublisher>(info.Holder());
    std::vector<openvslam::data::landmark*> allLandmarks;
    std::set<openvslam::data::landmark*> localLandmarks;
    obj->self->get_landmarks(allLandmarks, localLandmarks);
}
