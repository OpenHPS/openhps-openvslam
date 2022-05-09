#include "keyframe.h"

#include <string>
#include <iostream>
#include <Eigen/Core>
#include <nlohmann/json.hpp>

Nan::Persistent<v8::Function> KeyFrame::constructor;

KeyFrame::KeyFrame() {}

KeyFrame::~KeyFrame() {}

void KeyFrame::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("KeyFrame").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "toJSON", ToJSON);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("KeyFrame").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void KeyFrame::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        KeyFrame* obj = new KeyFrame();
        obj->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        // Invoked as plain function
        const int argc = 0;
        v8::Local<v8::Value> argv[argc] = { };
        v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
        info.GetReturnValue().Set(
            cons->NewInstance(context, argc, argv).ToLocalChecked());
    }
}

v8::Local<v8::Object> KeyFrame::NewInstance(std::shared_ptr<stella_vslam::data::keyframe> native) {
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    const int argc = 0;
    v8::Local<v8::Value> argv[0] = { };
    const v8::Local<v8::Object> result = Nan::NewInstance(cons, argc, argv).ToLocalChecked();

    KeyFrame* obj = Nan::ObjectWrap::Unwrap<KeyFrame>(result);
    obj->self = native;
    return result;
}

void KeyFrame::ToJSON(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    KeyFrame* obj = ObjectWrap::Unwrap<KeyFrame>(info.Holder());
    nlohmann::json json = obj->self->to_json();
    v8::Local<v8::String> json_string = Nan::New(json.dump()).ToLocalChecked();
    Nan::JSON NanJSON;
    Nan::MaybeLocal<v8::Value> result = NanJSON.Parse(json_string);
    info.GetReturnValue().Set(result.ToLocalChecked());
}
