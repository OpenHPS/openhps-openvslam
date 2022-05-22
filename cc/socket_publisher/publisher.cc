#include "publisher.h"

#include <string>

class SocketPublisherWorker : public Nan::AsyncWorker {
    public:
        std::shared_ptr<socket_publisher::publisher> publisher;

        SocketPublisherWorker(Nan::Callback *callback, std::shared_ptr<socket_publisher::publisher> publisher) : Nan::AsyncWorker(callback) {
            this->publisher = publisher;
        }

        ~SocketPublisherWorker() {
            this->publisher->request_terminate();
        }

        void Execute () {
            this->publisher->run();
        }

        virtual void HandleOKCallback() {
            
        }
};

Nan::Persistent<v8::Function> Publisher::constructor;

Publisher::Publisher(stella_vslam::system* system, const std::string& url) {
    YAML::Node node = YAML::Load("{server_uri: 'http://localhost:3000'}");
    self = std::make_shared<socket_publisher::publisher>(node, system, system->get_frame_publisher(), system->get_map_publisher());
}

Publisher::~Publisher() {}

void Publisher::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();
    Nan::HandleScope scope;

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("SocketPublisher").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "run", Run);
    Nan::SetPrototypeMethod(tpl, "terminate", Terminate);
    
    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("SocketPublisher").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void Publisher::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        System* system = Nan::ObjectWrap::Unwrap<System>(
            info[0]->ToObject(context).ToLocalChecked());
        v8::String::Utf8Value url(isolate, info[1]);
        Publisher* obj = new Publisher(system->self, std::string(*url));
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

void Publisher::Run(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    Publisher* obj = ObjectWrap::Unwrap<Publisher>(info.Holder());
    Nan::AsyncQueueWorker(new SocketPublisherWorker(nullptr, obj->self));
}

void Publisher::Terminate(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    Publisher* obj = ObjectWrap::Unwrap<Publisher>(info.Holder());
    obj->self->request_terminate();
}
