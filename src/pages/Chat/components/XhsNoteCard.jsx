import React from 'react';
import { Card, Avatar, Tooltip } from 'antd';
import { HeartOutlined, StarOutlined, MessageOutlined, PictureOutlined } from '@ant-design/icons';
import './XhsNoteCard.css';

const XhsNoteCard = ({ note }) => {
  // 检查笔记数据是否完整
  if (!note || !note.id) {
    return null; // 如果没有基本数据就不渲染
  }

  const {
    cover,
    cover_image,
    display_title,
    user = {},
    interact_info = {},
    desc,
    time,
    ip_location
  } = note;

  const getInteractCount = (count) => {
    if (!count || count === '0') return '0';
    if (typeof count === 'string') {
      // 如果已经是格式化的字符串（如"1.9万"），直接返回
      if (count.includes('万') || count.includes('k')) return count;
      const num = parseInt(count);
      if (num > 10000) return `${(num / 10000).toFixed(1)}万`;
      if (num > 1000) return `${(num / 1000).toFixed(1)}k`;
      return count;
    }
    if (typeof count === 'number') {
      if (count > 10000) return `${(count / 10000).toFixed(1)}万`;
      if (count > 1000) return `${(count / 1000).toFixed(1)}k`;
      return count.toString();
    }
    return '0';
  };

  // 获取封面图片URL
  const getCoverUrl = () => {
    // 优先使用 cover_image 字段（直接来自API）
    if (cover_image) return cover_image;
    // 备选：使用 cover.url_default
    if (cover?.url_default) return cover.url_default;
    // 备选：使用 images 数组的第一张图
    if (note.images && note.images.length > 0) return note.images[0];
    return null;
  };

  const coverUrl = getCoverUrl();
  // console.log('🎴 [XhsNoteCard] 最终获取的封面URL:', coverUrl);

  return (
    <Card
      hoverable
      className="xhs-note-card"
      cover={
        <div className="xhs-note-cover-wrapper">
          {coverUrl ? (
            <img 
              alt={display_title} 
              src={coverUrl} 
              className="xhs-note-cover-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('no-image');
              }}
            />
          ) : (
            <div className="xhs-note-no-image">
              <PictureOutlined />
            </div>
          )}
        </div>
      }
      bodyStyle={{ padding: '12px' }}
    >
      <div className="xhs-note-title" title={display_title}>
        {display_title || '无标题'}
      </div>
      
      {desc && (
        <div className="xhs-note-desc" title={desc}>
          {desc}
        </div>
      )}
      
                  <div className="xhs-note-footer">
              {/* 头像和昵称占一行 */}
              <div className="xhs-note-author">
                <Avatar
                  src={user.avatar || user.user_avatar}
                  size="small"
                  style={{ backgroundColor: '#f56a00' }}
                >
                  {!user.avatar && !user.user_avatar ? (user.nickname || user.user_nickname || '用户')?.charAt(0) : null}
                </Avatar>
                <span className="xhs-note-author-nickname" title={user.nickname || user.user_nickname}>
                  {user.nickname || user.user_nickname || '未知用户'}
                </span>
              </div>

              {/* 点赞收藏占一行 */}
              <div className="xhs-note-interactions">
                <Tooltip title={`点赞: ${interact_info.liked_count || '0'}`}>
                  <span className="interaction-item">
                    <HeartOutlined /> {getInteractCount(interact_info.liked_count)}
                  </span>
                </Tooltip>

                <Tooltip title={`评论: ${interact_info.comment_count || '0'}`}>
                  <span className="interaction-item">
                    <MessageOutlined /> {getInteractCount(interact_info.comment_count)}
                  </span>
                </Tooltip>

                <Tooltip title={`收藏: ${interact_info.collected_count || '0'}`}>
                  <span className="interaction-item">
                    <StarOutlined /> {getInteractCount(interact_info.collected_count)}
                  </span>
                </Tooltip>
              </div>
            </div>
      
      {(time || ip_location) && (
        <div className="xhs-note-meta">
          {time && <span className="time">{time}</span>}
          {ip_location && <span className="location">{ip_location}</span>}
        </div>
      )}
    </Card>
  );
};

export default XhsNoteCard; 