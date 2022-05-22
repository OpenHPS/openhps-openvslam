#include "frame_publisher.h"

#include <string>

Nan::Persistent<v8::Function> FramePublisher::constructor;

FramePublisher::FramePublisher(const stella_vslam::system* system) {
    self = system->get_frame_publisher();
}

FramePublisher::~FramePublisher() {}

void FramePublisher::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("FramePublisher").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "drawFrame", DrawFrame);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("FramePublisher").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void FramePublisher::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        System* system = Nan::ObjectWrap::Unwrap<System>(
            info[0]->ToObject(context).ToLocalChecked());
        FramePublisher* obj = new FramePublisher(system->self);
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

v8::Local<v8::Object> FramePublisher::NewInstance(System* system) {
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    const int argc = 1;
    v8::Local<v8::Value> argv[1] = {system->handle()};
    return Nan::NewInstance(cons, argc, argv).ToLocalChecked();
}

void FramePublisher::DrawFrame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    FramePublisher* obj = ObjectWrap::Unwrap<FramePublisher>(info.Holder());
    Mat* result = new Mat();
    result->setNativeObject(obj->self->draw_frame());
    info.GetReturnValue().Set(Nan::New(result));
}