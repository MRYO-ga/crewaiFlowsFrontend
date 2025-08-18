/**
 * 消息元数据适配器
 * 用于处理优化后的消息元数据格式，确保前端显示兼容性
 */

/**
 * 适配优化后的消息元数据为前端可用格式
 * @param {Object} message - 消息对象
 * @returns {Object} 适配后的消息对象
 */
export const adaptMessageMetadata = (message) => {
  if (!message || !message.message_metadata) {
    return message;
  }

  const metadata = message.message_metadata;
  
  // 如果已经是新格式（优化后的），需要转换为前端期望的格式
  if (metadata._optimized && metadata.steps_summary) {
    return adaptOptimizedMessage(message);
  }
  
  // 如果是旧格式，直接返回
  return message;
};

/**
 * 将优化后的消息转换为前端兼容格式
 * @param {Object} message - 包含优化元数据的消息
 * @returns {Object} 转换后的消息
 */
const adaptOptimizedMessage = (message) => {
  const metadata = message.message_metadata;
  const stepsSummary = metadata.steps_summary;
  
  // 重建前端需要的 steps 数组格式
  const adaptedSteps = [];
  
  // 处理 AI 内容
  if (stepsSummary.ai_content) {
    adaptedSteps.push({
      type: 'ai_message',
      content: stepsSummary.ai_content,
      timestamp: new Date().toISOString()
    });
  }
  
  // 处理工具调用
  if (stepsSummary.tool_calls && stepsSummary.tool_calls.calls) {
    stepsSummary.tool_calls.calls.forEach(call => {
      adaptedSteps.push({
        type: 'tool_calling',
        content: call.content,
        timestamp: call.timestamp,
        data: call.data || {}
      });
    });
  }
  
  // 处理工具结果
  if (stepsSummary.tool_results && stepsSummary.tool_results.results) {
    stepsSummary.tool_results.results.forEach(result => {
      adaptedSteps.push({
        type: 'tool_result',
        content: result.content,
        timestamp: result.timestamp,
        data: result.data || {}
      });
    });
  }
  
  // 按时间戳排序
  adaptedSteps.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return {
    ...message,
    steps: adaptedSteps,
    message_metadata: {
      ...metadata,
      // 保留原有字段以确保兼容性
      steps: adaptedSteps,
      // 添加优化信息标记
      _is_adapted: true,
      _original_optimized: true
    }
  };
};

/**
 * 检查消息是否包含工具调用
 * @param {Object} message - 消息对象
 * @returns {boolean} 是否包含工具调用
 */
export const hasToolCalls = (message) => {
  if (!message || !message.message_metadata) {
    return false;
  }
  
  const metadata = message.message_metadata;
  
  // 检查优化后格式
  if (metadata._optimized && metadata.steps_summary) {
    return !!(metadata.steps_summary.tool_calls && metadata.steps_summary.tool_calls.count > 0);
  }
  
  // 检查原格式
  if (metadata.steps && Array.isArray(metadata.steps)) {
    return metadata.steps.some(step => step.type === 'tool_calling');
  }
  
  return metadata.has_tool_calls || false;
};

/**
 * 检查消息是否包含侧边栏数据
 * @param {Object} message - 消息对象
 * @returns {boolean} 是否包含侧边栏数据
 */
export const hasSidebarData = (message) => {
  if (!message || !message.message_metadata) {
    return false;
  }
  
  const metadata = message.message_metadata;
  
  // 检查 XHS 结果
  if (metadata.xhs_results && Array.isArray(metadata.xhs_results) && metadata.xhs_results.length > 0) {
    return true;
  }
  
  return metadata.has_sidebar_data || false;
};

/**
 * 获取消息的 XHS 结果
 * @param {Object} message - 消息对象
 * @returns {Array} XHS 结果数组
 */
export const getXhsResults = (message) => {
  if (!message || !message.message_metadata) {
    return [];
  }
  
  return message.message_metadata.xhs_results || [];
};

/**
 * 获取消息的压缩统计信息
 * @param {Object} message - 消息对象
 * @returns {Object|null} 压缩统计信息
 */
export const getCompressionStats = (message) => {
  if (!message || !message.message_metadata || !message.message_metadata._optimized) {
    return null;
  }
  
  const metadata = message.message_metadata;
  return metadata.steps_stats || null;
};

/**
 * 批量适配消息列表
 * @param {Array} messages - 消息列表
 * @returns {Array} 适配后的消息列表
 */
export const adaptMessageList = (messages) => {
  if (!Array.isArray(messages)) {
    return messages;
  }
  
  return messages.map(adaptMessageMetadata);
};

/**
 * 开发调试：显示元数据优化信息
 * @param {Object} message - 消息对象
 */
export const logMetadataOptimization = (message) => {
  if (!message || !message.message_metadata) {
    return;
  }
  
  const metadata = message.message_metadata;
  
  if (metadata._optimized) {
    const stats = getCompressionStats(message);
    if (stats) {
      const compressionRatio = ((1 - stats.compressed_size / stats.original_size) * 100).toFixed(1);
      console.log(`📊 消息 ${message.id} 元数据已优化:`, {
        原始大小: `${(stats.original_size / 1024).toFixed(1)}KB`,
        压缩后大小: `${(stats.compressed_size / 1024).toFixed(1)}KB`,
        压缩率: `${compressionRatio}%`,
        原始步骤数: stats.original_count
      });
    }
  }
};

export default {
  adaptMessageMetadata,
  adaptMessageList,
  hasToolCalls,
  hasSidebarData,
  getXhsResults,
  getCompressionStats,
  logMetadataOptimization
};

