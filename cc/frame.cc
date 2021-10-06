#include "frame.h"

#include <string>

Nan::Persistent<v8::Function> Frame::constructor;

Frame::Frame() {

}

Frame::~Frame() {}

void Frame::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prototype
    Nan::SetPrototypeMethod(tpl, "getCamPose", GetCamPose);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("Frame").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Frame::GetCamPose(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    
}
