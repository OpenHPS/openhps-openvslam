#ifndef OPENHPS_OPENVSLAM_GRAPH_NODE_H
#define OPENHPS_OPENVSLAM_GRAPH_NODE_H

#include <nan.h>

#include <stella_vslam/data/graph_node.h>

class GraphNode : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        stella_vslam::graph_node* self;

    private:
        explicit GraphNode(const System* system);
        ~GraphNode();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif