#include "viewer.h"

#include <string>

Nan::Persistent<v8::Function> Viewer::constructor;

Viewer::Viewer(stella_vslam::system* system, const std::string& url) {
    YAML::Node node = YAML::Load("{}");
    self = std::make_shared<pangolin_viewer::viewer>(node, system, system->get_frame_publisher(), system->get_map_publisher());
}

Viewer::~Viewer() {}

void Viewer::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("PangolinViewer").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "run", Run);
    Nan::SetPrototypeMethod(tpl, "terminate", Terminate);
    
    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("PangolinViewer").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Viewer::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        System* system = Nan::ObjectWrap::Unwrap<System>(
            info[0]->ToObject(context).ToLocalChecked());
        v8::String::Utf8Value url(isolate, info[1]);
        Viewer* obj = new Viewer(system->self, std::string(*url));
        obj->Wrap(info.This());
        info.GetReturnValue().Set(info.This());
    } else {
        // Invoked as plain function
        const int argc = 2;
        v8::Local<v8::Value> argv[argc] = {info[0], info[1]};
        v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
        info.GetReturnValue().Set(
            cons->NewInstance(context, argc, argv).ToLocalChecked());
    }
}

void Viewer::Run(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    Viewer* obj = ObjectWrap::Unwrap<Viewer>(info.Holder());
    obj->self->run();
}

void Viewer::Terminate(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    Viewer* obj = ObjectWrap::Unwrap<Viewer>(info.Holder());
    obj->self->request_terminate();
}
