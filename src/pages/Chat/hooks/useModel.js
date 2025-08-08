import { useState } from 'react';
import { API_PATHS } from '../../../configs/env';

export const useModel = () => {
  const [selectedModel, setSelectedModel] = useState(
    localStorage.getItem('selectedModel') || 'gpt-4o-mini'
  );
  const [availableModels, setAvailableModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  const loadAvailableModels = async () => {
    try {
      setModelsLoading(true);
      const response = await fetch(`${API_PATHS.CHAT}available-models`);
      const data = await response.json();
      
      if (data.status === 'success' && data.models && data.models.length > 0) {
        setAvailableModels(data.models);
      } else {
        const defaultModels = [
          { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'openai', description: '快速、经济的模型，适合日常对话' },
          { value: 'gpt-4o', label: 'GPT-4o', provider: 'openai', description: '更强大的推理能力，适合复杂任务' },
          { value: 'gpt-5-2025-08-07', label: 'GPT-5 (2025-08-07)', provider: 'openai', description: '最新一代GPT-5，增强推理与工具使用能力' },
          { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4', provider: 'anthropic', description: '最新Claude模型，优秀的推理和创作能力' },
          { value: 'claude-3-7-sonnet-20250219-thinking', label: 'Claude 3.7 Sonnet (Thinking)', provider: 'anthropic', description: '具有深度思考能力的Claude模型' },
          { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet', provider: 'anthropic', description: '平衡性能和速度的Claude模型' },
          { value: 'deepseek-r1-250528', label: 'DeepSeek R1', provider: 'deepseek', description: '中文优化的强推理模型' }
        ];
        setAvailableModels(defaultModels);
      }
    } catch (error) {
      const defaultModels = [
        { value: 'gpt-4o-mini', label: 'GPT-4o Mini', provider: 'openai', description: '快速、经济的模型，适合日常对话' },
        { value: 'gpt-4o', label: 'GPT-4o', provider: 'openai', description: '更强大的推理能力，适合复杂任务' },
        { value: 'gpt-5-2025-08-07', label: 'GPT-5 (2025-08-07)', provider: 'openai', description: '最新一代GPT-5，增强推理与工具使用能力' },
        { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4', provider: 'anthropic', description: '最新Claude模型，优秀的推理和创作能力' },
        { value: 'claude-3-7-sonnet-20250219-thinking', label: 'Claude 3.7 Sonnet (Thinking)', provider: 'anthropic', description: '具有深度思考能力的Claude模型' },
        { value: 'claude-3-7-sonnet-20250219', label: 'Claude 3.7 Sonnet', provider: 'anthropic', description: '平衡性能和速度的Claude模型' },
        { value: 'deepseek-r1-250528', label: 'DeepSeek R1', provider: 'deepseek', description: '中文优化的强推理模型' }
      ];
      setAvailableModels(defaultModels);
    } finally {
      setModelsLoading(false);
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    localStorage.setItem('selectedModel', model);
  };

  return {
    selectedModel,
    availableModels,
    modelsLoading,
    loadAvailableModels,
    handleModelChange,
  };
};
