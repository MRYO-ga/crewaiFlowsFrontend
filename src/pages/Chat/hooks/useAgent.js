import { useState } from 'react';
import { agentOptions } from '../components/agentOptions';

export const useAgent = (setMessages, setStreamingMessage, setCurrentTask, setInputValue, inputRef) => {
  const [selectedAgent, setSelectedAgent] = useState(
    localStorage.getItem('selectedAgent') || 'general_chat'
  );
  const [showPersonaIntro, setShowPersonaIntro] = useState(false);
  const [currentPersonaIntro, setCurrentPersonaIntro] = useState('');

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent);
    localStorage.setItem('selectedAgent', agent);
    
    const selectedAgentOption = agentOptions.find(option => option.value === agent);
    
    if (selectedAgentOption) {
      setMessages([]);
      setStreamingMessage(null);
      setCurrentTask(null);
      
      setCurrentPersonaIntro(selectedAgentOption.introduction);
      setShowPersonaIntro(true);
      
      if (selectedAgentOption.defaultQuestion) {
        setInputValue(selectedAgentOption.defaultQuestion);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    }
  };

  return {
    selectedAgent,
    showPersonaIntro,
    setShowPersonaIntro,
    currentPersonaIntro,
    handleAgentChange,
  };
};
