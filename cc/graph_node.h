#ifndef OPENHPS_OPENVSLAM_GRAPH_NODE_H
#define OPENHPS_OPENVSLAM_GRAPH_NODE_H

#include <nan.h>

#include <stella_vslam/type.h>
#include <stella_vslam/data/graph_node.h>

class GraphNode : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        static v8::Local<v8::Object> NewInstance(std::unique_ptr<stella_vslam::data::graph_node>& native);
        std::unique_ptr<stella_vslam::data::graph_node> self;

    private:
        explicit GraphNode();
        ~GraphNode();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCovisibilitiesOverWeight(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif