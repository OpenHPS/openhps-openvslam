#ifndef OPENHPS_OPENVSLAM_GRAPH_NODE_H
#define OPENHPS_OPENVSLAM_GRAPH_NODE_H

#include <nan.h>

#include <stella_vslam/type.h>
#include <stella_vslam/data/keyframe.h>

class GraphNode : public Nan::ObjectWrap {
    public:
        static void Init(v8::Local<v8::Object> exports);
        // The graph node is owned by its keyframe, so keep a shared reference
        // to the owning keyframe instead of taking ownership of the graph node
        static v8::Local<v8::Object> NewInstance(std::shared_ptr<stella_vslam::data::keyframe> owner);
        std::shared_ptr<stella_vslam::data::keyframe> self;

    private:
        explicit GraphNode();
        ~GraphNode();

        static void New(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static void GetCovisibilitiesOverWeight(const Nan::FunctionCallbackInfo<v8::Value>& info);
        static Nan::Persistent<v8::Function> constructor;
};

#endif