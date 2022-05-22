#include "map_publisher.h"

#include <string>
#include <iostream>

Nan::Persistent<v8::Function> MapPublisher::constructor;

MapPublisher::MapPublisher(const stella_vslam::system* system) {
    self = system->get_map_publisher();
}

MapPublisher::~MapPublisher() {}

void MapPublisher::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();

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
    std::vector<std::shared_ptr<stella_vslam::data::keyframe>> keyframes;
    obj->self->get_keyframes(keyframes);
    
    const size_t outSize = keyframes.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    for (size_t i = 0; i < outSize; ++i) {
        Nan::Set(outArray, i, KeyFrame::NewInstance(keyframes[i]));
    }
    info.GetReturnValue().Set(outArray);
}

void MapPublisher::GetAllLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    MapPublisher* obj = ObjectWrap::Unwrap<MapPublisher>(info.Holder());
    std::vector<std::shared_ptr<stella_vslam::data::landmark>> allLandmarks;
    std::set<std::shared_ptr<stella_vslam::data::landmark>> localLandmarks;
    obj->self->get_landmarks(allLandmarks, localLandmarks);

    const size_t outSize = allLandmarks.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    for (size_t i = 0; i < outSize; ++i) {
        Nan::Set(outArray, i, Landmark::NewInstance(allLandmarks[i]));
    }
    info.GetReturnValue().Set(outArray);
}

void MapPublisher::GetLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    
}

void MapPublisher::GetLocalLandmarks(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    MapPublisher* obj = ObjectWrap::Unwrap<MapPublisher>(info.Holder());
    std::vector<std::shared_ptr<stella_vslam::data::landmark>> allLandmarks;
    std::set<std::shared_ptr<stella_vslam::data::landmark>> localLandmarks;
    obj->self->get_landmarks(allLandmarks, localLandmarks);

    const size_t outSize = localLandmarks.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    std::set<std::shared_ptr<stella_vslam::data::landmark>>::iterator it;
    size_t i = 0;
    for (it = localLandmarks.begin(); it != localLandmarks.end(); ++it) {
        Nan::Set(outArray, i, Landmark::NewInstance(*it));
        i++;
    }
    info.GetReturnValue().Set(outArray);
}
