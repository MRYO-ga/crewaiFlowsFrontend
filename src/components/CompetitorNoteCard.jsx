import React from 'react';
import { Card, Avatar, Tooltip, Tag, Button } from 'antd';
import { HeartOutlined, StarOutlined, MessageOutlined, PictureOutlined, EyeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '../configs/env';
import './CompetitorNoteCard.css';

const CompetitorNoteCard = ({ note, onNoteClick, onViewOriginal }) => {
  if (!note || !note.id) {
    return null;
  }

  const {
    id,
    title,
    display_title,
    desc,
    cover_image,
    cover_image_local,
    images,
    images_local,
    user,
    interact_info,
    liked_count,
    collected_count,
    comment_count,
    share_count,
    view_count,
    user_avatar,
    user_nickname,
    time,
    ip_location,
    type,
    topics,
    url,
    note_url
  } = note;

  const getInteractCount = (count) => {
    if (count === null || count === undefined || count === '0') return '0';
    const num = parseInt(String(count).replace(/,/g, ''));
    if (isNaN(num)) {
        // 如果是 "1.9万" 这种格式，直接返回
        if (typeof count === 'string' && (count.includes('万') || count.includes('k'))) {
            return count;
        }
        return '0';
    }
    if (num > 10000) return `${(num / 10000).toFixed(1)}万`;
    if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
    return String(num);
  };

  const getCoverUrl = () => {
    console.log(`🖼️ [CompetitorNoteCard] 笔记 ${id} 图片来源分析:`, {
      hasCoverImageLocal: !!cover_image_local,
      coverImageLocal: cover_image_local,
      hasCoverImage: !!cover_image,
      coverImage: cover_image,
      hasImagesLocal: !!(images_local && images_local.length > 0),
      imagesLocalCount: images_local?.length || 0,
      hasImages: !!(images && images.length > 0),
      imagesCount: images?.length || 0
    });

    // 优先使用本地图片路径
    if (cover_image_local) {
      // 转换本地路径为可访问的URL，统一处理路径分隔符
      const cleanedPath = cover_image_local.replace(/^.*?data[/\\]xhs_images[/\\]/, '').replace(/\\/g, '/');
      const localUrl = `${API_BASE_URL}/api/static/xhs_images/${cleanedPath}`;
      console.log(`✅ [CompetitorNoteCard] 笔记 ${id} 使用本地图片:`, localUrl);
      return localUrl;
    }
    if (cover_image) {
      console.log(`🌐 [CompetitorNoteCard] 笔记 ${id} 使用CDN图片:`, cover_image);
      return cover_image;
    }
    
    // 处理本地images_local数组
    if (images_local && images_local.length > 0) {
      const firstLocalImage = images_local.find(img => img.type && img.type.includes('cover'));
      if (firstLocalImage && firstLocalImage.local_path) {
        const cleanedPath = firstLocalImage.local_path.replace(/^.*?data[/\\]xhs_images[/\\]/, '').replace(/\\/g, '/');
        const localUrl = `${API_BASE_URL}/api/static/xhs_images/${cleanedPath}`;
        console.log(`✅ [CompetitorNoteCard] 笔记 ${id} 使用本地图片数组:`, localUrl);
        return localUrl;
      }
    }
    
    if (images && images.length > 0 && images[0].url_default) {
      console.log(`🌐 [CompetitorNoteCard] 笔记 ${id} 使用CDN图片数组:`, images[0].url_default);
      return images[0].url_default;
    }
    
    console.log(`❌ [CompetitorNoteCard] 笔记 ${id} 无可用图片`);
    return null;
  };

  const coverUrl = getCoverUrl();
  const finalLikedCount = getInteractCount(liked_count || interact_info?.liked_count);
  const finalCollectedCount = getInteractCount(collected_count || interact_info?.collected_count);
  const finalCommentCount = getInteractCount(comment_count || interact_info?.comment_count);
  const finalShareCount = getInteractCount(share_count || interact_info?.share_count);
  const finalViewCount = getInteractCount(view_count || interact_info?.view_count);
  const finalUserAvatar = user_avatar || user?.avatar;
  const finalUserNickname = user_nickname || user?.nickname;
  const finalTitle = title || display_title || '无标题';

  const getTypeTag = (noteType) => {
    // 只显示视频标签，不显示normal或其他类型
    if (noteType === 'video') {
      return (
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            视频
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      hoverable
      className="competitor-note-card"
      bodyStyle={{ padding: '12px' }}
      cover={
        <div className="competitor-note-cover-wrapper relative aspect-[3/4] overflow-hidden">
          {coverUrl ? (
            <img 
              alt={finalTitle} 
              src={coverUrl} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('no-image');
              }}
            />
          ) : (
            <div className="competitor-note-no-image w-full h-full flex items-center justify-center bg-gray-100">
              <PictureOutlined className="text-gray-400 text-2xl" />
            </div>
          )}
          {/* 类型标签 */}
          {getTypeTag(type) && (
            <div className="absolute top-2 right-2">
              {getTypeTag(type)}
            </div>
          )}
        </div>
      }
    >
      {/* 标题 */}
      <div className="competitor-note-title" title={finalTitle}>
        {finalTitle}
      </div>
      
      {/* 描述 */}
      {desc && (
        <div className="competitor-note-desc" title={desc}>
          {desc.length > 100 ? `${desc.substring(0, 100)}...` : desc}
        </div>
      )}
      
      {/* 话题标签 */}
      {topics && topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {topics.slice(0, 3).map((tag, index) => (
            <Tag key={index} size="small" color="blue-inverse">#{tag}</Tag>
          ))}
          {topics.length > 3 && (
            <Tag size="small" color="default">+{topics.length - 3}</Tag>
          )}
        </div>
      )}
      
      {/* 用户信息 */}
      <div className="competitor-note-author mb-3">
        <Avatar
          src={finalUserAvatar}
          size="small"
          style={{ backgroundColor: '#f56a00' }}
        >
          {!finalUserAvatar ? (finalUserNickname || '用户')?.charAt(0) : null}
        </Avatar>
        <span className="competitor-note-author-nickname" title={finalUserNickname}>
          {finalUserNickname || '未知用户'}
        </span>
        {ip_location && (
          <span className="text-xs text-gray-400 ml-2">📍 {ip_location}</span>
        )}
      </div>

      {/* 互动数据 */}
      <div className="competitor-note-interactions mb-3">
        <div className="grid grid-cols-5 gap-2 text-center">
          <Tooltip title={`点赞: ${liked_count || interact_info?.liked_count || '0'}`}>
            <div className="interaction-item">
              <HeartOutlined className="text-red-500" />
              <span className="text-xs ml-1">{finalLikedCount}</span>
            </div>
          </Tooltip>
          
          <Tooltip title={`收藏: ${collected_count || interact_info?.collected_count || '0'}`}>
            <div className="interaction-item">
              <StarOutlined className="text-yellow-500" />
              <span className="text-xs ml-1">{finalCollectedCount}</span>
            </div>
          </Tooltip>
          
          <Tooltip title={`评论: ${comment_count || interact_info?.comment_count || '0'}`}>
            <div className="interaction-item">
              <MessageOutlined className="text-blue-500" />
              <span className="text-xs ml-1">{finalCommentCount}</span>
            </div>
          </Tooltip>
          
          <Tooltip title={`分享: ${share_count || interact_info?.share_count || '0'}`}>
            <div className="interaction-item">
              <ShareAltOutlined className="text-green-500" />
              <span className="text-xs ml-1">{finalShareCount}</span>
            </div>
          </Tooltip>
          
          <Tooltip title={`浏览: ${view_count || interact_info?.view_count || '0'}`}>
            <div className="interaction-item">
              <EyeOutlined className="text-purple-500" />
              <span className="text-xs ml-1">{finalViewCount}</span>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* 发布时间 */}
      {time && (
        <div className="text-xs text-gray-400 mb-3 text-center">
          {time}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex space-x-2">
        <Button 
          size="small" 
          type="primary" 
          block
          onClick={() => onNoteClick && onNoteClick(note)}
        >
          深度分析
        </Button>
        <Button 
          size="small" 
          block
          onClick={() => onViewOriginal && onViewOriginal(note_url || url)}
        >
          查看原文
        </Button>
      </div>
    </Card>
  );
};

export default CompetitorNoteCard;

