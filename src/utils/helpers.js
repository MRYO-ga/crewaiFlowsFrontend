/**
 * 格式化文件大小
 * @param {number} bytes - 文件大小（字节）
 * @returns {string} - 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * 格式化日期时间
 * @param {Date|string|number} date - 日期对象或时间戳
 * @param {string} format - 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} - 格式化后的日期时间字符串
 */
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} - 文件扩展名（小写）
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * 检查文件类型是否允许
 * @param {File} file - 文件对象
 * @param {string[]} allowedTypes - 允许的文件类型数组
 * @returns {boolean} - 是否允许
 */
export const isFileTypeAllowed = (file, allowedTypes) => {
  const extension = getFileExtension(file.name);
  return allowedTypes.includes(extension);
};

/**
 * 检查文件大小是否在限制范围内
 * @param {File} file - 文件对象
 * @param {number} maxSize - 最大文件大小（字节）
 * @returns {boolean} - 是否在限制范围内
 */
export const isFileSizeAllowed = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * 生成随机ID
 * @param {number} length - ID长度
 * @returns {string} - 随机ID
 */
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, length + 2);
};

/**
 * 防抖函数
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} - 节流后的函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<void>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
};

/**
 * 格式化时间差
 * @param {Date|string|number} date - 日期对象或时间戳
 * @returns {string} - 格式化后的时间差
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else if (minutes > 0) {
    return `${minutes}分钟前`;
  } else {
    return '刚刚';
  }
};

/**
 * 格式化数字（添加千位分隔符）
 * @param {number} num - 数字
 * @returns {string} - 格式化后的数字
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {string} currency - 货币符号，默认为 '¥'
 * @returns {string} - 格式化后的金额
 */
export const formatAmount = (amount, currency = '¥') => {
  return `${currency}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * 获取文件图标
 * @param {string} filename - 文件名
 * @returns {string} - 文件图标类名
 */
export const getFileIcon = (filename) => {
  const extension = getFileExtension(filename);
  const iconMap = {
    pdf: 'fa-file-pdf',
    doc: 'fa-file-word',
    docx: 'fa-file-word',
    xls: 'fa-file-excel',
    xlsx: 'fa-file-excel',
    ppt: 'fa-file-powerpoint',
    pptx: 'fa-file-powerpoint',
    jpg: 'fa-file-image',
    jpeg: 'fa-file-image',
    png: 'fa-file-image',
    gif: 'fa-file-image',
    zip: 'fa-file-archive',
    rar: 'fa-file-archive',
    txt: 'fa-file-text',
    mp3: 'fa-file-audio',
    mp4: 'fa-file-video'
  };

  return `fa-solid ${iconMap[extension] || 'fa-file'}`;
}; 