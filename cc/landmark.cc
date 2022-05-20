#include "landmark.h"

#include <string>
#include <iostream>
#include <Eigen/Core>
#include <nlohmann/json.hpp>

Nan::Persistent<v8::Function> Landmark::constructor;

Landmark::Landmark() {}

Landmark::~Landmark() {}

void Landmark::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("Landmark").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "getPosInWorld", GetPosInWorld);
    Nan::SetPrototypeMethod(tpl, "toJSON", ToJSON);
    Nan::SetAccessor(tpl->InstanceTemplate(), Nan::New("id").ToLocalChecked(), GetId);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("Landmark").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Landmark::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        Landmark* obj = new Landmark();
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

v8::Local<v8::Object> Landmark::NewInstance(std::shared_ptr<stella_vslam::data::landmark> native) {
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    const int argc = 0;
    v8::Local<v8::Value> argv[0] = { };
    const v8::Local<v8::Object> result = Nan::NewInstance(cons, argc, argv).ToLocalChecked();

    Landmark* obj = Nan::ObjectWrap::Unwrap<Landmark>(result);
    obj->self = native;
    return result;
}

void Landmark::GetId(v8::Local<v8::String> property, const Nan::PropertyCallbackInfo<v8::Value>& info) {
    Landmark* obj = ObjectWrap::Unwrap<Landmark>(info.Holder());
    info.GetReturnValue().Set(obj->self->id_);
}

void Landmark::GetPosInWorld(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    Landmark* obj = ObjectWrap::Unwrap<Landmark>(info.Holder());
    Eigen::Vector3d pos = obj->self->get_pos_in_world();
    const size_t outSize = pos.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    for (size_t i = 0; i < outSize; ++i) {
        Nan::Set(outArray, i, Nan::New<v8::Number>(*(pos.data() + i)));
    }
    info.GetReturnValue().Set(outArray);
}

void Landmark::ToJSON(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    Landmark* obj = ObjectWrap::Unwrap<Landmark>(info.Holder());
    nlohmann::json json = obj->self->to_json();
    v8::Local<v8::String> json_string = Nan::New(json.dump()).ToLocalChecked();
    Nan::JSON NanJSON;
    Nan::MaybeLocal<v8::Value> result = NanJSON.Parse(json_string);
    info.GetReturnValue().Set(result.ToLocalChecked());
}
