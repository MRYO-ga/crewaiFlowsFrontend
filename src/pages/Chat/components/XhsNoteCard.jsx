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
    cover_image_local,
    images,
    images_local,
    user,
    interact_info,
    liked_count,
    collected_count,
    comment_count,
    user_avatar,
    user_nickname,
    time,
    ip_location,
    type,
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
    // console.log(`🖼️ [XhsNoteCard] 笔记 ${id} 图片来源分析:`, {
    //   hasCoverImageLocal: !!cover_image_local,
    //   coverImageLocal: cover_image_local,
    //   hasCoverImage: !!cover_image,
    //   coverImage: cover_image,
    //   hasImagesLocal: !!(images_local && images_local.length > 0),
    //   imagesLocalCount: images_local?.length || 0,
    //   hasImages: !!(images && images.length > 0),
    //   imagesCount: images?.length || 0,
    //   imagesLocalData: images_local?.slice(0, 2) // 显示前2个本地图片的详细信息
    // });

    // 优先使用本地图片路径
    if (cover_image_local && cover_image_local.trim()) {
      // 转换本地路径为可访问的URL，统一处理路径分隔符
      const cleanedPath = cover_image_local.replace(/^.*?data[/\\]xhs_images[/\\]/, '').replace(/\\/g, '/');
      const localUrl = `http://localhost:9000/static/xhs_images/${cleanedPath}`;
      console.log(`✅ [XhsNoteCard] 笔记 ${id} 使用本地封面图片:`, localUrl);
      return localUrl;
    }
    
    // 如果没有封面图，检查本地images_local数组
    if (images_local && images_local.length > 0) {
      // 先查找标记为封面的图片
      const coverImage = images_local.find(img => img.type && img.type.includes('cover'));
      if (coverImage && coverImage.local_path) {
        const cleanedPath = coverImage.local_path.replace(/^.*?data[/\\]xhs_images[/\\]/, '').replace(/\\/g, '/');
        const localUrl = `http://localhost:9000/static/xhs_images/${cleanedPath}`;
        console.log(`✅ [XhsNoteCard] 笔记 ${id} 使用本地封面图片(从images_local):`, localUrl);
        return localUrl;
      }
      
      // 如果没有封面图，使用第一张本地图片
      const firstLocalImage = images_local[0];
      if (firstLocalImage && firstLocalImage.local_path) {
        const cleanedPath = firstLocalImage.local_path.replace(/^.*?data[/\\]xhs_images[/\\]/, '').replace(/\\/g, '/');
        const localUrl = `http://localhost:9000/static/xhs_images/${cleanedPath}`;
        console.log(`✅ [XhsNoteCard] 笔记 ${id} 使用第一张本地图片:`, localUrl);
        return localUrl;
      }
    }
    
    // 如果都没有本地图片，才使用CDN图片
    if (cover_image) {
      console.log(`🌐 [XhsNoteCard] 笔记 ${id} 使用CDN封面图片:`, cover_image);
      return cover_image;
    }
    
    if (images && images.length > 0 && images[0].url_default) {
      console.log(`🌐 [XhsNoteCard] 笔记 ${id} 使用CDN图片数组:`, images[0].url_default);
      return images[0].url_default;
    }
    
    console.log(`❌ [XhsNoteCard] 笔记 ${id} 无可用图片`);
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
      className="h-full border border-gray-200 rounded-lg overflow-hidden"
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
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {coverUrl ? (
            <img 
              alt={display_title} 
              src={coverUrl} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('no-image');
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <PictureOutlined className="text-gray-400 text-2xl" />
            </div>
          )}
          {/* 只显示视频标签（无图标） */}
          {type === 'video' && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
                视频
              </span>
            </div>
          )}
        </div>
      }
      bodyStyle={{ padding: '12px' }}
    >
      <div className="flex flex-col h-full">
        {/* 标题 */}
        <div className="font-medium text-sm text-gray-900 mb-2 line-clamp-2" title={display_title}>
          {display_title || '无标题'}
        </div>
        
        {/* 描述 */}
        {desc && (
          <div className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow" title={desc}>
            {desc}
          </div>
        )}
        
        {/* 互动数据 */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <HeartOutlined className="mr-1 text-red-500" />
              {finalLikedCount}
            </span>
            <span className="flex items-center">
              <StarOutlined className="mr-1 text-yellow-500" />
              {finalCollectedCount}
            </span>
            <span className="flex items-center">
              <MessageOutlined className="mr-1 text-blue-500" />
              {finalCommentCount}
            </span>
          </div>
        </div>
        
        {/* 作者和时间信息 */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center min-w-0 flex-1">
            <Avatar
              src={finalUserAvatar}
              size={18}
              className="flex-shrink-0"
              style={{ backgroundColor: '#f56a00' }}
            >
              {!finalUserAvatar ? (finalUserNickname || '用户')?.charAt(0) : null}
            </Avatar>
            <span className="ml-2 text-xs text-gray-600 truncate" title={finalUserNickname}>
              {finalUserNickname || '未知用户'}
            </span>
          </div>
          
          <div className="flex items-center text-xs text-gray-400 ml-2">
            <span>{time}</span>
            {ip_location && <span className="ml-1">·{ip_location}</span>}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default XhsNoteCard; 