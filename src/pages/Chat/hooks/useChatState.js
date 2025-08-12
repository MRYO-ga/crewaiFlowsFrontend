import { useState, useRef } from 'react';

export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [lastAiStructuredData, setLastAiStructuredData] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskHistory, setTaskHistory] = useState([]);
  const [abortController, setAbortController] = useState(null);
  const [executionTime, setExecutionTime] = useState(0);
  
  // 聊天历史相关状态
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [saveToHistory, setSaveToHistory] = useState(true);
  const [showChatHistory, setShowChatHistory] = useState(false);
  
  const inputRef = useRef(null);
  const executionTimerRef = useRef(null);

  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    streamingMessage,
    setStreamingMessage,
    lastAiStructuredData,
    setLastAiStructuredData,
    currentTask,
    setCurrentTask,
    taskHistory,
    setTaskHistory,
    abortController,
    setAbortController,
    executionTime,
    setExecutionTime,
    // 聊天历史状态
    currentSessionId,
    setCurrentSessionId,
    saveToHistory,
    setSaveToHistory,
    showChatHistory,
    setShowChatHistory,
    inputRef,
    executionTimerRef,
  };
};
