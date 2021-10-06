#include "frame_publisher.h"

#include <string>

Nan::Persistent<v8::Function> FramePublisher::constructor;

FramePublisher::FramePublisher(const openvslam::system* system) {
    self = system->get_frame_publisher();
}

FramePublisher::~FramePublisher() {}

void FramePublisher::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

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
    
}

void FramePublisher::DrawFrame(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    bool drawText = info[0]->IsUndefined() ? true : info[0]->BooleanValue(isolate);

    FramePublisher* obj = ObjectWrap::Unwrap<FramePublisher>(info.Holder());
    Mat* result = new Mat();
    result->setNativeObject(obj->self->draw_frame(drawText));
    info.GetReturnValue().Set(Nan::New(result));
}