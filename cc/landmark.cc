#include "landmark.h"

#include <string>
#include <Eigen/Core>
#include <nlohmann/json.hpp>

Nan::Persistent<v8::Function> Landmark::constructor;

Landmark::Landmark(openvslam::data::landmark* landmark) {
    self = landmark;
}

Landmark::~Landmark() {}

void Landmark::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("Landmark").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "getPosInWorld", GetPosInWorld);
    Nan::SetPrototypeMethod(tpl, "toJSON", ToJSON);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("Landmark").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Landmark::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

v8::Local<v8::Object> Landmark::NewInstance(openvslam::data::landmark* landmark) {
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    const int argc = 1;
    v8::Local<v8::Value> argv[1] = {system->handle()};
    return Nan::NewInstance(cons, argc, argv).ToLocalChecked();
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
