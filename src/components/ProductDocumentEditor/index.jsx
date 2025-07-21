import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Button, Input, Form, message, Spin, Select } from 'antd';
import { EditOutlined, SaveOutlined, FileTextOutlined, MessageOutlined, FormOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { productService } from '../../services/productApi';
import './ProductDocumentEditor.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ProductDocumentEditor = ({ visible, onCancel, productId, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('document');
  
  // 编辑状态
  const [documentContent, setDocumentContent] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  
  // 表单实例
  const [form] = Form.useForm();
  
  // 加载产品数据
  useEffect(() => {
    if (productId && visible) {
      fetchProductData();
    }
  }, [productId, visible]);
  
  // 获取产品数据
  const fetchProductData = async () => {
    try {
      setLoading(true);
      const data = await productService.getProductDocument(productId);
      setProduct(data);
      
      // 设置各部分数据
      setDocumentContent(data.document_content || '');
      setChatHistory(data.chat_history || []);
      
      // 设置表单数据 - 从phase1_data中获取所有字段
      const phase1Data = data.phase1_data || {};
      
      form.setFieldsValue({
        // 基本信息
        product_name: data.product_name,
        brand_name: data.brand_name,
        product_category: data.product_category,
        price_range: data.price_range,
        target_audience: data.target_audience,
        summary: data.summary,
        
        // 账号信息
        accountNickname: phase1Data.accountNickname,
        accountType: phase1Data.accountType,
        fansCount: phase1Data.fansCount,
        profileUrl: phase1Data.profileUrl,
        
        // 人设与定位
        contentCategory: phase1Data.contentCategory,
        otherContentCategory: phase1Data.otherContentCategory,
        audienceProfile: phase1Data.audienceProfile,
        personalityTags: phase1Data.personalityTags,
        contentStyle: phase1Data.contentStyle,
        contentStyleDetail: phase1Data.contentStyleDetail,
        
        // 产品与卖点
        mainProduct: phase1Data.mainProduct,
        productFeatures: phase1Data.productFeatures,
        competitors: phase1Data.competitors,
        existingContent: phase1Data.existingContent,
        
        // 营销目标
        marketingGoals: phase1Data.marketingGoals,
        hasAdvertising: phase1Data.hasAdvertising,
        advertisingNote: phase1Data.advertisingNote,
        conversionTracking: phase1Data.conversionTracking,
        
        // 内容素材与限制
        hasBrandMaterials: phase1Data.hasBrandMaterials,
        brandMaterials: phase1Data.brandMaterials,
        brandGuidelines: phase1Data.brandGuidelines,
        contentTypes: phase1Data.contentTypes,
        otherContentTypes: phase1Data.otherContentTypes,
        restrictions: phase1Data.restrictions,
        
        // 时间与预算
        campaignTiming: phase1Data.campaignTiming,
        budget: phase1Data.budget,
        phaseNote: phase1Data.phaseNote,
        
        // 额外信息
        additionalInfo: phase1Data.additionalInfo
      });
    } catch (error) {
      message.error('获取产品文档失败');
      console.error('获取产品文档失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 保存文档内容
  const saveDocumentContent = async () => {
    try {
      setSaving(true);
      await productService.updateProductDocumentContent(productId, documentContent);
      message.success('文档内容保存成功');
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      message.error('保存文档内容失败');
      console.error('保存文档内容失败:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // 保存聊天历史
  const saveChatHistory = async () => {
    try {
      setSaving(true);
      await productService.updateProductChatHistory(productId, chatHistory);
      message.success('聊天历史保存成功');
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      message.error('保存聊天历史失败');
      console.error('保存聊天历史失败:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // 保存基本信息
  const saveBasicInfo = async (values) => {
    try {
      setSaving(true);
      
      // 更新基本信息
      const basicInfo = {
        product_name: values.product_name,
        brand_name: values.brand_name,
        product_category: values.product_category,
        price_range: values.price_range,
        target_audience: values.target_audience,
        summary: values.summary
      };
      
      await productService.updateProductDocument(productId, basicInfo);
      
      // 更新第一阶段数据
      const phase1Data = {
        // 账号信息
        accountNickname: values.accountNickname,
        accountType: values.accountType,
        fansCount: values.fansCount,
        profileUrl: values.profileUrl,
        
        // 人设与定位
        contentCategory: values.contentCategory,
        otherContentCategory: values.otherContentCategory,
        audienceProfile: values.audienceProfile,
        personalityTags: values.personalityTags,
        contentStyle: values.contentStyle,
        contentStyleDetail: values.contentStyleDetail,
        
        // 产品与卖点
        mainProduct: values.mainProduct,
        productFeatures: values.productFeatures,
        competitors: values.competitors,
        existingContent: values.existingContent,
        
        // 营销目标
        marketingGoals: values.marketingGoals,
        hasAdvertising: values.hasAdvertising,
        advertisingNote: values.advertisingNote,
        conversionTracking: values.conversionTracking,
        
        // 内容素材与限制
        hasBrandMaterials: values.hasBrandMaterials,
        brandMaterials: values.brandMaterials,
        brandGuidelines: values.brandGuidelines,
        contentTypes: values.contentTypes,
        otherContentTypes: values.otherContentTypes,
        restrictions: values.restrictions,
        
        // 时间与预算
        campaignTiming: values.campaignTiming,
        budget: values.budget,
        phaseNote: values.phaseNote,
        
        // 额外信息
        additionalInfo: values.additionalInfo
      };
      
      await productService.updateProductPhase1Data(productId, phase1Data);
      
      message.success('基本信息保存成功');
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      message.error('保存基本信息失败');
      console.error('保存基本信息失败:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // 渲染聊天消息
  const renderChatMessage = (message, index) => {
    const isAI = message.type === 'ai';
    
    return (
      <div 
        key={index} 
        className={`mb-4 p-3 rounded-lg ${isAI ? 'bg-purple-50' : 'bg-blue-50'}`}
      >
        <div className="flex items-center mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAI ? 'bg-purple-500' : 'bg-blue-500'}`}>
            <span className="text-white font-medium">{isAI ? 'AI' : 'U'}</span>
          </div>
          <div className="ml-2 text-sm font-medium">
            {isAI ? 'AI助手' : '用户'}
          </div>
          <div className="ml-auto text-xs text-gray-500">
            {message.timestamp ? new Date(message.timestamp).toLocaleString() : '未知时间'}
          </div>
        </div>
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <Modal
        visible={visible}
        title="加载中..."
        onCancel={onCancel}
        footer={null}
        width={1000}
      >
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal
      visible={visible}
      title={
        <div className="flex items-center">
          <EditOutlined className="mr-2" />
          <span>编辑产品文档: {product?.product_name}</span>
        </div>
      }
      onCancel={onCancel}
      footer={null}
      width={1000}
      bodyStyle={{ padding: '0px' }}
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        className="product-document-editor-tabs"
        tabBarExtraContent={
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            loading={saving}
            onClick={() => {
              if (activeTab === 'document') {
                saveDocumentContent();
              } else if (activeTab === 'chat') {
                saveChatHistory();
              } else if (activeTab === 'basic') {
                form.submit();
              }
            }}
          >
            保存{activeTab === 'document' ? '文档内容' : activeTab === 'chat' ? '聊天历史' : '基本信息'}
          </Button>
        }
      >
        <TabPane 
          tab={
            <span>
              <FileTextOutlined />
              文档内容（第二阶段）
            </span>
          } 
          key="document"
        >
          <div className="p-4">
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">编辑文档内容</div>
              <TextArea 
                value={documentContent}
                onChange={(e) => setDocumentContent(e.target.value)}
                placeholder="请输入文档内容（支持Markdown格式）"
                autoSize={{ minRows: 20, maxRows: 30 }}
              />
            </div>
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <MessageOutlined />
              聊天历史
            </span>
          } 
          key="chat"
        >
          <div className="p-4">
            <div className="text-sm text-gray-500 mb-4">
              以下是AI对话的聊天历史记录：
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50 mb-4 max-h-96 overflow-y-auto">
              {chatHistory && chatHistory.map((message, index) => 
                renderChatMessage(message, index)
              )}
              
              {(!chatHistory || chatHistory.length === 0) && (
                <div className="text-center text-gray-500 py-8">
                  暂无聊天历史记录
                </div>
              )}
            </div>
          </div>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <EditOutlined />
              基本信息
            </span>
          } 
          key="basic"
        >
          <div className="p-4 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={saveBasicInfo}
            >
              <h3 className="text-lg font-medium mb-4">产品基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="product_name"
                  label="产品名称"
                  rules={[{ required: true, message: '请输入产品名称' }]}
                >
                  <Input placeholder="请输入产品名称" />
                </Form.Item>
                
                <Form.Item
                  name="brand_name"
                  label="品牌名称"
                >
                  <Input placeholder="请输入品牌名称" />
                </Form.Item>
                
                <Form.Item
                  name="product_category"
                  label="产品类别"
                >
                  <Input placeholder="请输入产品类别" />
                </Form.Item>
                
                <Form.Item
                  name="price_range"
                  label="价格区间"
                >
                  <Input placeholder="请输入价格区间" />
                </Form.Item>
              </div>
              
              <Form.Item
                name="target_audience"
                label="目标用户群体"
              >
                <TextArea placeholder="请输入目标用户群体" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="summary"
                label="简短摘要"
              >
                <TextArea placeholder="请输入简短摘要" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <h3 className="text-lg font-medium mt-6 mb-4">1. 账号信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="accountNickname"
                  label="小红书账号昵称"
                >
                  <Input placeholder="请输入账号昵称" />
                </Form.Item>
                
                <Form.Item
                  name="accountType"
                  label="账号类型"
                >
                  <Select placeholder="请选择账号类型">
                    <Option value="brand">品牌号</Option>
                    <Option value="personal">个人号</Option>
                    <Option value="kol">达人号</Option>
                    <Option value="mcn">MCN机构</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="fansCount"
                  label="当前粉丝数"
                >
                  <Input placeholder="请输入当前粉丝数" />
                </Form.Item>
                
                <Form.Item
                  name="profileUrl"
                  label="主页链接"
                >
                  <Input placeholder="请输入小红书主页链接" />
                </Form.Item>
              </div>
              
              <h3 className="text-lg font-medium mt-6 mb-4">2. 人设与定位</h3>
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  name="contentCategory"
                  label="主营内容领域"
                >
                  <Select placeholder="请选择内容领域">
                    <Option value="beauty">美妆</Option>
                    <Option value="fashion">穿搭</Option>
                    <Option value="parenting">母婴</Option>
                    <Option value="health">健康</Option>
                    <Option value="tech">数码</Option>
                    <Option value="emotion">情感</Option>
                    <Option value="food">美食</Option>
                    <Option value="lifestyle">生活方式</Option>
                    <Option value="other">其他</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="contentStyle"
                  label="内容风格偏好"
                >
                  <Select placeholder="请选择内容风格">
                    <Option value="lifestyle">生活化</Option>
                    <Option value="professional">专业种草</Option>
                    <Option value="emotional">情绪共鸣</Option>
                    <Option value="educational">知识型</Option>
                    <Option value="entertainment">娱乐化</Option>
                  </Select>
                </Form.Item>
              </div>
              
              <Form.Item
                name="otherContentCategory"
                label="其他内容领域"
              >
                <Input placeholder="请具体描述您的内容领域，多个领域用 / 分隔" />
              </Form.Item>
              
              <Form.Item
                name="audienceProfile"
                label="核心受众画像"
              >
                <TextArea placeholder="请描述目标受众的年龄、性别、城市、兴趣等特征" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="personalityTags"
                label="特定人设标签"
              >
                <Input placeholder="请输入特定人设标签，多个标签用逗号分隔" />
              </Form.Item>
              
              <Form.Item
                name="contentStyleDetail"
                label="风格细节"
              >
                <TextArea placeholder="请描述更具体的风格细节（如创意感、技术酷感等）" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <h3 className="text-lg font-medium mt-6 mb-4">3. 主推产品与卖点</h3>
              <Form.Item
                name="mainProduct"
                label="主推产品/服务名称"
              >
                <Input placeholder="请输入主推产品或服务名称" />
              </Form.Item>
              
              <Form.Item
                name="productFeatures"
                label="产品核心卖点"
              >
                <TextArea placeholder="请输入产品核心卖点，多个卖点请换行" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="competitors"
                label="竞品参考"
              >
                <TextArea placeholder="请输入竞品信息（品牌名+产品）" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="existingContent"
                label="现有种草素材/评测报告"
              >
                <TextArea placeholder="如有现成的种草素材或评测报告，请填写链接或内容" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <h3 className="text-lg font-medium mt-6 mb-4">4. 营销目标</h3>
              <Form.Item
                name="marketingGoals"
                label="本轮目标类型"
              >
                <Select mode="multiple" placeholder="请选择营销目标">
                  <Option value="exposure">提升曝光</Option>
                  <Option value="followers">涨粉</Option>
                  <Option value="collection">引导收藏</Option>
                  <Option value="consultation">引导私信咨询</Option>
                  <Option value="conversion">带货转化</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="hasAdvertising"
                label="是否配合投放"
                valuePropName="checked"
              >
                <Select placeholder="请选择是否配合投放">
                  <Option value={true}>是</Option>
                  <Option value={false}>否</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="advertisingNote"
                label="投放说明"
              >
                <TextArea placeholder="请描述投放说明，例如兴趣定向、预算范围等" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="conversionTracking"
                label="转化跟踪"
              >
                <TextArea placeholder="请描述转化跟踪方式，例如短链、埋点等" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <h3 className="text-lg font-medium mt-6 mb-4">5. 内容素材与限制</h3>
              <Form.Item
                name="hasBrandMaterials"
                label="是否提供品牌物料"
                valuePropName="checked"
              >
                <Select placeholder="请选择是否提供品牌物料">
                  <Option value={true}>是</Option>
                  <Option value={false}>否</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="brandMaterials"
                label="品牌物料"
              >
                <TextArea placeholder="请描述提供的品牌物料（如主KV、功能图解、产品截图等）" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="brandGuidelines"
                label="品牌内容规范或风格要求"
              >
                <TextArea placeholder="请输入品牌内容规范或风格要求" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="contentTypes"
                label="可接受的内容类型"
              >
                <Select mode="multiple" placeholder="请选择内容类型">
                  <Option value="image">图文笔记</Option>
                  <Option value="video">视频笔记</Option>
                </Select>
              </Form.Item>
              
              <Form.Item
                name="otherContentTypes"
                label="其他内容类型"
              >
                <Input placeholder="其他内容类型（如有），多个类型用逗号分隔" />
              </Form.Item>
              
              <Form.Item
                name="restrictions"
                label="禁止事项"
              >
                <TextArea placeholder="请输入禁止事项（如不能提及价格/疗效/敏感词等）" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <h3 className="text-lg font-medium mt-6 mb-4">6. 时间与预算</h3>
              <Form.Item
                name="campaignTiming"
                label="节日/节点配合"
              >
                <TextArea placeholder="请输入需要配合的节日或节点（如618、双11等）" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="budget"
                label="预算范围"
              >
                <TextArea placeholder="请输入预算范围（可填写参考CPC/CPM/千次费用）" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <Form.Item
                name="phaseNote"
                label="分阶段发布计划"
              >
                <TextArea placeholder="如需分阶段发布，请描述各阶段计划" autoSize={{ minRows: 2, maxRows: 4 }} />
              </Form.Item>
              
              <h3 className="text-lg font-medium mt-6 mb-4">7. 额外信息补充</h3>
              <Form.Item
                name="additionalInfo"
                label="其他需要补充的信息"
              >
                <TextArea placeholder="请输入任何其他需要补充的信息" autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>
            </Form>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ProductDocumentEditor; 