#include "landmark.h"

#include <string>

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

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("Landmark").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Landmark::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {

}

void Landmark::GetPosInWorld(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    
}
