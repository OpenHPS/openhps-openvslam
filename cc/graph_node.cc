#include "keyframe.h"

#include <string>
#include <iostream>
#include <Eigen/Core>
#include <nlohmann/json.hpp>

Nan::Persistent<v8::Function> GraphNode::constructor;

GraphNode::GraphNode() {}

GraphNode::~GraphNode() {}

void GraphNode::Init(v8::Local<v8::Object> exports) {
    v8::Local<v8::Context> context = exports->CreationContext();

    // Prepare constructor template
    v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
    tpl->SetClassName(Nan::New("GraphNode").ToLocalChecked());
    tpl->InstanceTemplate()->SetInternalFieldCount(1);

    // Prototype
    Nan::SetPrototypeMethod(tpl, "getCovisibilitiesOverWeight", GetCovisibilitiesOverWeight);

    constructor.Reset(tpl->GetFunction(context).ToLocalChecked());
    exports->Set(context,
                Nan::New("GraphNode").ToLocalChecked(),
                tpl->GetFunction(context).ToLocalChecked());
}

void GraphNode::New(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();   
    v8::Local<v8::Context> context = isolate->GetCurrentContext();
    if (info.IsConstructCall()) {
        // Invoked as constructor
        GraphNode* obj = new GraphNode();
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

v8::Local<v8::Object> GraphNode::NewInstance(std::unique_ptr<stella_vslam::data::graph_node>& native) {
    v8::Local<v8::Function> cons = Nan::New<v8::Function>(constructor);
    const int argc = 0;
    v8::Local<v8::Value> argv[0] = { };
    const v8::Local<v8::Object> result = Nan::NewInstance(cons, argc, argv).ToLocalChecked();

    GraphNode* obj = Nan::ObjectWrap::Unwrap<GraphNode>(result);
    obj->self = std::move(native);
    return result;
}

void GraphNode::GetCovisibilitiesOverWeight(const Nan::FunctionCallbackInfo<v8::Value>& info) {
    v8::Isolate *isolate = info.GetIsolate();
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    GraphNode* obj = ObjectWrap::Unwrap<GraphNode>(info.Holder());
    unsigned int weight = info[0]->NumberValue(context).FromJust();
    std::vector<std::shared_ptr<stella_vslam::data::keyframe>> keyframes = obj->self->get_covisibilities_over_weight(weight);

    const size_t outSize = keyframes.size();
    v8::Local<v8::Array> outArray = Nan::New<v8::Array>(outSize);
    for (size_t i = 0; i < outSize; ++i) {
        Nan::Set(outArray, i, KeyFrame::NewInstance(keyframes[i]));
    }
    info.GetReturnValue().Set(outArray);
}