#include "frame_publisher.h"

#include <string>

Nan::Persistent<v8::Function> FramePublisher::constructor;

FramePublisher::FramePublisher(const System* system) {
    publisher = system->SLAM->get_frame_publisher();
}

FramePublisher::~FramePublisher() {}

void FramePublisher::NAN_INIT(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(NAN_NEW);
    tpl->SetClassName(Nan::New("FramePublisher").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("FramePublisher").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void FramePublisher::NAN_NEW(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        System* system = Nan::ObjectWrap::Unwrap<System>(
            info[0]->ToObject(context).ToLocalChecked());
        FramePublisher* obj = new FramePublisher(system);
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
