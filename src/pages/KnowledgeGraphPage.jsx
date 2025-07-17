import React, { useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 节点类型定义
const nodeTypes = {
  entity: ({ data }) => (
    <div className={`rounded-lg p-3 shadow-md ${data.color}`}>
      <div className="font-bold text-sm">{data.label}</div>
      {data.description && <div className="text-xs mt-1">{data.description}</div>}
    </div>
  ),
};

const KnowledgeGraphPage = () => {
  // 定义实体节点颜色
  const entityColors = {
    participant: 'bg-blue-100 border border-blue-500',
    content: 'bg-green-100 border border-green-500',
    data: 'bg-purple-100 border border-purple-500',
    strategy: 'bg-yellow-100 border border-yellow-500',
    compliance: 'bg-red-100 border border-red-500',
    event: 'bg-orange-100 border border-orange-500',
  };

  // 初始化知识图谱节点
  const initialNodes = [
    // 参与主体
    { id: 'brand', type: 'entity', data: { label: '品牌', description: '含子品牌、品牌方', color: entityColors.participant }, position: { x: 250, y: 50 } },
    { id: 'consumer', type: 'entity', data: { label: '消费者', description: '用户画像标签化', color: entityColors.participant }, position: { x: 50, y: 150 } },
    { id: 'creator', type: 'entity', data: { label: '创作者', description: '个性创作者、机构创作者', color: entityColors.participant }, position: { x: 250, y: 250 } },
    { id: 'platform', type: 'entity', data: { label: '平台', description: '功能模块、AI引擎', color: entityColors.participant }, position: { x: 450, y: 150 } },
    
    // 营销内容
    { id: 'marketingContent', type: 'entity', data: { label: '营销内容', description: '图文、视频、文案等', color: entityColors.content }, position: { x: 150, y: 350 } },
    { id: 'brandCore', type: 'entity', data: { label: '品牌内核', description: '文化、愿景、价值观', color: entityColors.content }, position: { x: 350, y: 350 } },
    { id: 'contentStrategy', type: 'entity', data: { label: '内容策略', description: '主题、风格、渠道适配', color: entityColors.content }, position: { x: 250, y: 450 } },
    
    // 数据与洞察
    { id: 'marketTrend', type: 'entity', data: { label: '市场动态', description: '趋势、竞品动作', color: entityColors.data }, position: { x: 550, y: 250 } },
    { id: 'userData', type: 'entity', data: { label: '用户数据', description: '需求、行为、情感', color: entityColors.data }, position: { x: 50, y: 250 } },
    { id: 'industryKnowledge', type: 'entity', data: { label: '行业知识', description: '全球策略、标杆案例', color: entityColors.data }, position: { x: 650, y: 350 } },
    
    // 策略与执行
    { id: 'marketingStrategy', type: 'entity', data: { label: '营销战略', color: entityColors.strategy }, position: { x: 450, y: 450 } },
    { id: 'executionPlan', type: 'entity', data: { label: '执行方案', color: entityColors.strategy }, position: { x: 550, y: 550 } },
    { id: 'strategyAdjustment', type: 'entity', data: { label: '策略调整', description: '依据、结果', color: entityColors.strategy }, position: { x: 350, y: 550 } },
    { id: 'keywords', type: 'entity', data: { label: '关键词', description: '热点词、品牌词、用户词', color: entityColors.strategy }, position: { x: 150, y: 550 } },
    
    // 合规与风险
    { id: 'industryRegulations', type: 'entity', data: { label: '行业规范', description: '法规、政策', color: entityColors.compliance }, position: { x: 650, y: 450 } },
    { id: 'platformRules', type: 'entity', data: { label: '平台规则', color: entityColors.compliance }, position: { x: 750, y: 350 } },
    { id: 'riskTypes', type: 'entity', data: { label: '风险类型', description: '合规风险、品牌形象风险', color: entityColors.compliance }, position: { x: 750, y: 450 } },
    { id: 'trustIndicators', type: 'entity', data: { label: '信任指标', description: '用户信任度、公信力', color: entityColors.compliance }, position: { x: 750, y: 550 } },
    
    // 动态事件
    { id: 'socialDynamics', type: 'entity', data: { label: '社交动态', color: entityColors.event }, position: { x: 50, y: 450 } },
    { id: 'festivalEvents', type: 'entity', data: { label: '节庆节点', color: entityColors.event }, position: { x: 50, y: 550 } },
    { id: 'emergencyEvents', type: 'entity', data: { label: '突发事件', description: '类型、影响范围', color: entityColors.event }, position: { x: 50, y: 650 } },
  ];

  // 初始化知识图谱关系
  const initialEdges = [
    // 参与主体间关系
    { id: 'e1', source: 'brand', target: 'platform', label: '合作/依托', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2', source: 'platform', target: 'consumer', label: '连接', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3', source: 'creator', target: 'brand', label: '服务', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e4', source: 'platform', target: 'brandCore', label: '理解/生成', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // 内容与数据的关系
    { id: 'e5', source: 'marketingContent', target: 'brandCore', label: '来源于', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e6', source: 'marketingContent', target: 'userData', label: '优化自', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e7', source: 'platform', target: 'marketTrend', label: '捕捉/分析', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e8', source: 'userData', target: 'strategyAdjustment', label: '支撑', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // 策略与执行的关系
    { id: 'e9', source: 'marketingStrategy', target: 'executionPlan', label: '拆解为', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e10', source: 'socialDynamics', target: 'contentStrategy', label: '触发', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e11', source: 'festivalEvents', target: 'contentStrategy', label: '触发', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e12', source: 'emergencyEvents', target: 'contentStrategy', label: '触发', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e13', source: 'keywords', target: 'contentStrategy', label: '关联', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // 合规与价值的关系
    { id: 'e14', source: 'industryRegulations', target: 'marketingContent', label: '约束', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e15', source: 'platformRules', target: 'marketingContent', label: '约束', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e16', source: 'riskTypes', target: 'trustIndicators', label: '影响', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    
    // 知识与创新的关系
    { id: 'e17', source: 'industryKnowledge', target: 'marketingStrategy', label: '包含', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e18', source: 'creator', target: 'industryKnowledge', label: '调用', type: 'straight', markerEnd: { type: MarkerType.ArrowClosed } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 图例组件
  const Legend = () => (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
      <h3 className="font-bold mb-2">图例</h3>
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center">
          <div className={`w-4 h-4 mr-2 ${entityColors.participant}`}></div>
          <span>参与主体</span>
        </div>
        <div className="flex items-center">
          <div className={`w-4 h-4 mr-2 ${entityColors.content}`}></div>
          <span>营销内容</span>
        </div>
        <div className="flex items-center">
          <div className={`w-4 h-4 mr-2 ${entityColors.data}`}></div>
          <span>数据与洞察</span>
        </div>
        <div className="flex items-center">
          <div className={`w-4 h-4 mr-2 ${entityColors.strategy}`}></div>
          <span>策略与执行</span>
        </div>
        <div className="flex items-center">
          <div className={`w-4 h-4 mr-2 ${entityColors.compliance}`}></div>
          <span>合规与风险</span>
        </div>
        <div className="flex items-center">
          <div className={`w-4 h-4 mr-2 ${entityColors.event}`}></div>
          <span>动态事件</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-dark mb-2">营销知识图谱</h1>
      <p className="text-gray-600 mb-6">围绕"品牌-消费者-平台-生态要素"的核心链路，实现营销知识的结构化与关联化</p>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-dark mb-4">知识图谱可视化</h2>
        <p className="text-gray-600 mb-4">本图谱展示了营销平台中的核心实体及其关系，包括参与主体、营销内容、数据洞察、策略执行、合规风险和动态事件六大类实体。</p>
        
        <div style={{ width: '100%', height: '700px' }} className="relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
            <Legend />
          </ReactFlow>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-dark mb-4">知识图谱说明</h2>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">核心实体层</h3>
          <p className="text-gray-600 mb-2">基于平台功能与业务场景，提炼核心实体类型，覆盖全链路参与方、要素及过程。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">参与主体</h4>
              <p>品牌、消费者、创作者、平台</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">营销内容</h4>
              <p>营销内容、品牌内核、内容策略</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">数据与洞察</h4>
              <p>市场动态、用户数据、行业知识</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">策略与执行</h4>
              <p>营销战略、执行方案、策略调整、关键词</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">合规与风险</h4>
              <p>行业规范、平台规则、风险类型、信任指标</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">动态事件</h4>
              <p>社交动态、节庆节点、突发事件</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold text-lg mb-2">关系层</h3>
          <p className="text-gray-600 mb-2">通过定义实体间的关联关系，体现平台的业务逻辑与交互流程。</p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li><span className="font-medium">参与主体间关系</span>：品牌依托平台，平台连接消费者，创作者服务品牌等</li>
            <li><span className="font-medium">内容与数据的关系</span>：营销内容来源于品牌内核，基于用户反馈优化等</li>
            <li><span className="font-medium">策略与执行的关系</span>：营销战略拆解为执行方案，动态事件触发内容策略等</li>
            <li><span className="font-medium">合规与价值的关系</span>：行业规范约束营销内容，风险类型影响信任指标等</li>
            <li><span className="font-medium">知识与创新的关系</span>：行业知识库包含全球策略，创作者调用行业知识等</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold text-lg mb-2">属性层</h3>
          <p className="text-gray-600 mb-2">为实体补充属性信息，增强知识的颗粒度与可复用性。</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">品牌属性</h4>
              <p>行业、规模、目标市场、品牌文化标签、历史营销案例</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">消费者属性</h4>
              <p>人口统计学特征、行为标签、情感倾向、需求类型</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">营销内容属性</h4>
              <p>形式、适配渠道、关联品牌内核、优化依据</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">策略属性</h4>
              <p>类型、时间维度、关联事件、数据支撑</p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-bold">合规属性</h4>
              <p>适用规范、风险等级、信任维护目标</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage; 