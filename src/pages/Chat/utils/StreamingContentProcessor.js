/**
 * 流式内容处理器 - 优化格式检测和输出
 * 实现快速格式识别，小缓冲区管理
 */

class StreamingContentProcessor {
  constructor() {
    this.buffer = '';
    this.maxBufferSize = 1024; // 最大缓冲区1KB
    this.pendingFormats = new Map();
    this.formatHandlers = new Map();
    this.isInFormat = false;
    this.currentFormatType = null;
    this.formatStartPos = -1;
    
    // 注册格式处理器
    this.registerFormatHandlers();
  }

  registerFormatHandlers() {
    // Markdown格式
    this.formatHandlers.set('markdown', {
      start: '<markdown>',
      end: '</markdown>',
      priority: 1,
      process: (content) => ({ type: 'markdown', content: content })
    });

    // JSON格式
    this.formatHandlers.set('json', {
      start: '<json>',
      end: '</json>',
      priority: 2,
      process: (content) => ({ type: 'json', content: content })
    });

    // Chat状态格式
    this.formatHandlers.set('chat_status', {
      start: '<chat_status>',
      end: '</chat_status>',
      priority: 3,
      process: (content) => ({ type: 'chat_status', content: content })
    });

    // 工具调用格式
    this.formatHandlers.set('tool_calling', {
      start: '<tool_calling>',
      end: '</tool_calling>',
      priority: 4,
      process: (content) => ({ type: 'tool_calling', content: content })
    });

    // 工具结果格式
    this.formatHandlers.set('tool_result', {
      start: '<tool_result>',
      end: '</tool_result>',
      priority: 5,
      process: (content) => ({ type: 'tool_result', content: content })
    });

    // 笔记生成格式
    this.formatHandlers.set('note_generation', {
      start: '<note_generation>',
      end: '</note_generation>',
      priority: 6,
      process: (content) => ({ type: 'note_generation', content: content })
    });
  }

  /**
   * 处理新到达的内容
   * @param {string} newContent 新到达的内容
   * @returns {Array} 处理后的内容块数组
   */
  processContent(newContent) {
    this.buffer += newContent;
    
    // 检查缓冲区大小，避免过大
    if (this.buffer.length > this.maxBufferSize * 2) {
      this.buffer = this.buffer.slice(-this.maxBufferSize);
    }

    const results = [];
    let processedPos = 0;

    // 如果已经在格式中，先检查结束标记
    if (this.isInFormat) {
      const handler = this.formatHandlers.get(this.currentFormatType);
      if (handler) {
        const endPos = this.buffer.indexOf(handler.end, this.formatStartPos);
        if (endPos !== -1) {
          // 找到结束标记，处理完整格式
          const content = this.buffer.substring(this.formatStartPos + handler.start.length, endPos);
          results.push(handler.process(content));
          
          processedPos = endPos + handler.end.length;
          this.isInFormat = false;
          this.currentFormatType = null;
          this.formatStartPos = -1;
        } else {
          // 未找到结束标记，不输出任何内容
          return [];
        }
      }
    }

    // 处理剩余内容
    let searchPos = processedPos;
    while (searchPos < this.buffer.length) {
      let earliestFormat = null;
      let earliestPos = -1;

      // 查找最近的格式开始标记
      for (const [type, handler] of this.formatHandlers) {
        const pos = this.buffer.indexOf(handler.start, searchPos);
        if (pos !== -1 && (earliestPos === -1 || pos < earliestPos)) {
          earliestFormat = { type, handler, pos };
          earliestPos = pos;
        }
      }

      if (earliestFormat) {
        // 在格式开始前的普通内容
        if (earliestPos > searchPos) {
          const plainContent = this.buffer.substring(searchPos, earliestPos);
          if (plainContent.trim()) {
            results.push({ type: 'plain', content: plainContent });
          }
        }

        // 检查这个格式是否有结束标记
        const endPos = this.buffer.indexOf(earliestFormat.handler.end, earliestPos + earliestFormat.handler.start.length);
        if (endPos !== -1) {
          // 完整格式，立即处理
          const content = this.buffer.substring(
            earliestPos + earliestFormat.handler.start.length,
            endPos
          );
          results.push(earliestFormat.handler.process(content));
          searchPos = endPos + earliestFormat.handler.end.length;
        } else {
          // 不完整格式，进入等待状态
          this.isInFormat = true;
          this.currentFormatType = earliestFormat.type;
          this.formatStartPos = earliestPos;
          
          // 输出格式开始前的内容
          const beforeFormat = this.buffer.substring(searchPos, earliestPos);
          if (beforeFormat.trim()) {
            results.push({ type: 'plain', content: beforeFormat });
          }
          
          // 清空已处理的缓冲区
          this.buffer = this.buffer.substring(earliestPos);
          return results;
        }
      } else {
        // 没有更多格式标记，剩余都是普通内容
        const remaining = this.buffer.substring(searchPos);
        if (remaining.trim()) {
          results.push({ type: 'plain', content: remaining });
        }
        this.buffer = '';
        break;
      }
    }

    // 清空已处理的缓冲区
    this.buffer = '';
    return results;
  }

  /**
   * 强制刷新缓冲区，输出所有剩余内容
   * @returns {Array} 剩余内容块
   */
  flush() {
    const results = [];
    
    if (this.buffer.trim()) {
      // 如果在格式中，强制结束并输出原样
      if (this.isInFormat) {
        const handler = this.formatHandlers.get(this.currentFormatType);
        if (handler) {
          // 输出格式开始前的内容
          const beforeFormat = this.buffer.substring(0, this.formatStartPos);
          if (beforeFormat.trim()) {
            results.push({ type: 'plain', content: beforeFormat });
          }
          
          // 输出格式内容（不包含标记）
          const content = this.buffer.substring(this.formatStartPos + handler.start.length);
          if (content.trim()) {
            results.push({ type: 'plain', content });
          }
        } else {
          results.push({ type: 'plain', content: this.buffer });
        }
      } else {
        results.push({ type: 'plain', content: this.buffer });
      }
    }

    this.reset();
    return results;
  }

  /**
   * 重置处理器状态
   */
  reset() {
    this.buffer = '';
    this.isInFormat = false;
    this.currentFormatType = null;
    this.formatStartPos = -1;
  }

  /**
   * 获取当前缓冲区状态（用于调试）
   */
  getStatus() {
    return {
      bufferLength: this.buffer.length,
      isInFormat: this.isInFormat,
      currentFormatType: this.currentFormatType,
      bufferContent: this.buffer
    };
  }
}

export default StreamingContentProcessor;