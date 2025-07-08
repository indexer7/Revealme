import React from "react";
import { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  Handle,
  Node,
  Edge,
} from "@xyflow/react";

// Node types
function StepNode({ data }: any) {
  return (
    <div className="custom-node step-node">
      {data.label}
    </div>
  );
}
function DecisionNode({ data }: any) {
  return (
    <div className="custom-node decision-node">
      {data.label}
    </div>
  );
}
const nodeTypes = { step: StepNode, decision: DecisionNode };

const initialNodes: Node[] = [
  { id: "1", position: { x: 400, y: 40 },   type: "step", data: { label: "Start: User Initiates\nExposure Assessment" } },
  { id: "2", position: { x: 400, y: 160 },  type: "step", data: { label: "Specify Domain or\nEmail Target" } },
  { id: "3", position: { x: 400, y: 260 },  type: "step", data: { label: "OSINT Collection\nEngine Activated" } },
  { id: "4", position: { x: 400, y: 360 },  type: "step", data: { label: "Data Normalized into\nJSON Format" } },
  { id: "5", position: { x: 400, y: 460 },  type: "step", data: { label: "Scoring Engine\nProcesses Data" } },
  { id: "6", position: { x: 400, y: 560 },  type: "step", data: { label: "OES Score & Risk\nLevel Generated" } },
  { id: "7", position: { x: 400, y: 660 },  type: "step", data: { label: "Dashboard\nVisualization Review" } },
  { id: "8", position: { x: 400, y: 770 },  type: "decision", data: { label: "Generate Report?" } },
  { id: "9", position: { x: 260, y: 880 },  type: "decision", data: { label: "Adjust Scoring or\nRisk Weights?" } },
  { id: "10", position: { x: 560, y: 880 }, type: "step", data: { label: "User Customizes\nPenalty Weights &\nRisk Thresholds" } },
  { id: "11", position: { x: 400, y: 1040 }, type: "step", data: { label: "Download Structured\nReport" } },
  { id: "12", position: { x: 400, y: 1160 }, type: "step", data: { label: "End of Platform\nInteraction" } },
  { id: "13", position: { x: 400, y: 1260 }, type: "step", data: { label: "Engage Cycops for\nSecurity Services" } },
  { id: "14", position: { x: 250, y: 1380 }, type: "step", data: { label: "0-30 Days: Critical\nRisk Mitigation" } },
  { id: "15", position: { x: 570, y: 1380 }, type: "step", data: { label: "Harden Critical\nInfrastructure" } },
  { id: "16", position: { x:  80, y: 1500 }, type: "step", data: { label: "Implement Executive\nProtection Protocols" } },
  { id: "17", position: { x: 330, y: 1500 }, type: "step", data: { label: "Transform Employee\nSecurity Awareness" } },
  { id: "18", position: { x: 570, y: 1500 }, type: "step", data: { label: "30-90 Days: Long-\nTerm Security\nTransformation" } },
  { id: "19", position: { x: 20, y: 1620 }, type: "step", data: { label: "Deploy Advanced\nThreat Detection\nPlatforms" } },
  { id: "20", position: { x: 280, y: 1620 }, type: "step", data: { label: "Implement Supply\nChain Security Program" } },
  { id: "21", position: { x: 520, y: 1620 }, type: "step", data: { label: "Establish IP\nProtection Measures" } },
  { id: "22", position: { x: 760, y: 1620 }, type: "step", data: { label: "Quarterly Security\nAssessments &\nExecutive Advisory" } },
  { id: "23", position: { x: 520, y: 1740 }, type: "step", data: { label: "Annual: Ongoing\nSecurity Partnership" } },
  { id: "24", position: { x: 280, y: 1740 }, type: "step", data: { label: "Subscribe to Managed\nSecurity Services" } },
  { id: "25", position: { x: 760, y: 1740 }, type: "step", data: { label: "Use Threat\nIntelligence Services" } },
];

const initialEdges: Edge[] = [
  { id: "e1-2",   source: "1", target: "2", type: "smoothstep", },
  { id: "e2-3",   source: "2", target: "3", type: "smoothstep", },
  { id: "e3-4",   source: "3", target: "4", type: "smoothstep", },
  { id: "e4-5",   source: "4", target: "5", type: "smoothstep", },
  { id: "e5-6",   source: "5", target: "6", type: "smoothstep", },
  { id: "e6-7",   source: "6", target: "7", type: "smoothstep", },
  { id: "e7-8",   source: "7", target: "8", type: "smoothstep", },
  { id: "e8-9",   source: "8", target: "9", sourceHandle: null, targetHandle: null, type: "smoothstep", label: "No", labelBgStyle: { fill: '#fff', fillOpacity: 0.7 } },
  { id: "e8-10",  source: "8", target: "10", sourceHandle: null, targetHandle: null, type: "smoothstep", label: "Yes", labelBgStyle: { fill: '#fff', fillOpacity: 0.7 },  },
  { id: "e9-11",  source: "9", target: "11", type: "smoothstep", label: "No", labelBgStyle: { fill: '#fff', fillOpacity: 0.7 } },
  { id: "e10-11", source: "10", target: "11", type: "smoothstep" },
  { id: "e11-12", source: "11", target: "12", type: "smoothstep" },
  { id: "e12-13", source: "12", target: "13", type: "smoothstep" },
  { id: "e13-14", source: "13", target: "14", type: "smoothstep" },
  { id: "e13-15", source: "13", target: "15", type: "smoothstep" },
  { id: "e14-16", source: "14", target: "16", type: "smoothstep" },
  { id: "e14-17", source: "14", target: "17", type: "smoothstep" },
  { id: "e15-18", source: "15", target: "18", type: "smoothstep" },
  { id: "e16-19", source: "16", target: "19", type: "smoothstep" },
  { id: "e17-20", source: "17", target: "20", type: "smoothstep" },
  { id: "e18-21", source: "18", target: "21", type: "smoothstep" },
  { id: "e18-22", source: "18", target: "22", type: "smoothstep" },
  { id: "e21-23", source: "21", target: "23", type: "smoothstep" },
  { id: "e20-24", source: "20", target: "24", type: "smoothstep" },
  { id: "e23-25", source: "23", target: "25", type: "smoothstep" },
];

export default function FlowDiagramPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: any) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  return (
    <div className="flow-root-bg min-h-screen w-full flex flex-col">
      <h1 className="font-bold text-3xl mb-2 mt-4 text-center text-gray-900">Exposure Assessment Process Flow</h1>
      <div className="flex-1 w-full flex justify-center">
        <div style={{ width: 950, height: 1950, background: "none" }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            style={{ background: "transparent" }}
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap
              nodeStrokeColor={(n) => "#000000"}
              nodeColor={(n) => "#ffffff"}
            />
            <Controls />
            <Background color="#e0e0e0" gap={32} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
