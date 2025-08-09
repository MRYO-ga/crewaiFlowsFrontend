import React from 'react';
import { Card, Avatar, Tooltip, Popconfirm } from 'antd';
import { HeartOutlined, StarOutlined, MessageOutlined, PictureOutlined, DeleteOutlined } from '@ant-design/icons';
import './XhsNoteCard.css';

const XhsNoteCard = ({ note, onDelete }) => {
  if (!note || !note.id) {
    return null;
  }

  const {
    id,
    display_title,
    desc,
    cover_image,
    images,
    user,
    interact_info,
    liked_count,
    collected_count,
    comment_count,
    user_avatar,
    user_nickname,
    time,
    ip_location,
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
    if (cover_image) return cover_image;
    if (images && images.length > 0 && images[0].url_default) return images[0].url_default;
    return null;
  };

  const coverUrl = getCoverUrl();
  const finalLikedCount = getInteractCount(liked_count || interact_info?.liked_count);
  const finalCollectedCount = getInteractCount(collected_count || interact_info?.collected_count);
  const finalCommentCount = getInteractCount(comment_count || interact_info?.comment_count);
  const finalUserAvatar = user_avatar || user?.avatar;
  const finalUserNickname = user_nickname || user?.nickname;

  return (
    <Card
      hoverable
      className="xhs-note-card"
      actions={onDelete ? [
        <Popconfirm
          title="确定要删除这个笔记吗？"
          onConfirm={onDelete}
          okText="是的"
          cancelText="再想想"
        >
          <DeleteOutlined key="delete" />
        </Popconfirm>
      ] : []}
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
          <div className="xhs-note-author">
            <Avatar
              src={finalUserAvatar}
              size="small"
              style={{ backgroundColor: '#f56a00' }}
            >
              {!finalUserAvatar ? (finalUserNickname || '用户')?.charAt(0) : null}
            </Avatar>
            <span className="xhs-note-author-nickname" title={finalUserNickname}>
              {finalUserNickname || '未知用户'}
            </span>
          </div>

          <div className="xhs-note-interactions">
            <Tooltip title={`点赞: ${liked_count || interact_info?.liked_count || '0'}`}>
              <span className="interaction-item">
                <HeartOutlined /> {finalLikedCount}
              </span>
            </Tooltip>

            <Tooltip title={`评论: ${comment_count || interact_info?.comment_count || '0'}`}>
              <span className="interaction-item">
                <MessageOutlined /> {finalCommentCount}
              </span>
            </Tooltip>

            <Tooltip title={`收藏: ${collected_count || interact_info?.collected_count || '0'}`}>
              <span className="interaction-item">
                <StarOutlined /> {finalCollectedCount}
              </span>
            </Tooltip>
          </div>
        </div>
    </Card>
  );
};

export default XhsNoteCard; 