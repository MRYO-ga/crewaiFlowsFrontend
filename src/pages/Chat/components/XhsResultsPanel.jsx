import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Empty, Tag, Divider } from 'antd';
import { CloseOutlined, ExperimentOutlined, SearchOutlined } from '@ant-design/icons';
import XhsNoteCard from './XhsNoteCard';
import './XhsResultsPanel.css';

const getToolIcon = (toolName) => {
    if (toolName.includes('search')) {
        return <SearchOutlined />;
    }
    if (toolName.includes('home_feed')) {
        return <ExperimentOutlined />;
    }
    return <ExperimentOutlined />;
};


const XhsResultsPanel = ({ results, onClose, isVisible, onWidthChange }) => {
    const [isResizing, setIsResizing] = useState(false);
    const [width, setWidth] = useState(400);
    const panelRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            // 400 is min width, 800 is max width (same as DocumentPanel)
            const newWidth = Math.min(800, Math.max(400, window.innerWidth - e.clientX));
            setWidth(newWidth);
            if (onWidthChange) {
                onWidthChange(newWidth);
            }
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        if (isVisible && panelRef.current) {
            panelRef.current.scrollTop = 0;
        }
    }, [results, isVisible]);


    if (!isVisible) return null;

    return (
        <div className="xhs-results-panel" style={{ width: `${width}px` }}>
            <div
                className="resize-handle"
                onMouseDown={handleMouseDown}
            />
            <div className="xhs-results-panel-header">
                <span style={{ fontWeight: 'bold' }}>小红书工具结果</span>
                <div>
                    <Tooltip title="关闭">
                        <Button icon={<CloseOutlined />} onClick={onClose} type="text" />
                    </Tooltip>
                </div>
            </div>
            <div className="xhs-results-panel-content" ref={panelRef}>
                {results.length === 0 ? (
                    <Empty description="暂无小红书笔记数据" style={{ marginTop: '50%' }} />
                ) : (
                    [...results].reverse().map(group => (
                        <div 
                            key={group.group_id} 
                            className="result-group"
                        >
                            <Divider orientation="left" plain>
                                <div className="group-header">
                                    {getToolIcon(group.tool_name)}
                                    <span className="group-title">{group.tool_name === 'search_notes' ? `搜索: "${group.tool_args.keywords}"` : '首页推荐'}</span>
                                    <Tag color="blue">{group.notes_data.notes.length} 条</Tag>
                                </div>
                            </Divider>
                            <div className="notes-horizontal-container">
                                {/* 分两排显示笔记 */}
                                {(() => {
                                    const notes = group.notes_data.notes.filter(note => note && note.id && (note.display_title || note.desc));
                                    
                                    // 调试打印：显示侧边栏笔记的图片来源统计
                                    console.log(`📊 [XhsResultsPanel] 侧边栏笔记组 ${group.group_id} 图片来源统计:`, {
                                        totalNotes: notes.length,
                                        toolName: group.tool_name,
                                        notesWithLocalCover: notes.filter(note => note.cover_image_local).length,
                                        notesWithCdnCover: notes.filter(note => note.cover_image && !note.cover_image_local).length,
                                        notesWithLocalImages: notes.filter(note => note.images_local?.length > 0).length,
                                        notesWithCdnImages: notes.filter(note => note.images?.length > 0).length
                                    });
                                    
                                    // 详细打印前3个笔记的图片信息
                                    notes.slice(0, 3).forEach((note, index) => {
                                        console.log(`📝 [XhsResultsPanel] 侧边栏笔记 ${index + 1} (${note.id}) 图片详情:`, {
                                            title: note.display_title?.substring(0, 20) + '...',
                                            hasCoverImageLocal: !!note.cover_image_local,
                                            hasCoverImage: !!note.cover_image,
                                            hasImagesLocal: !!(note.images_local?.length > 0),
                                            hasImages: !!(note.images?.length > 0),
                                            preferredSource: note.cover_image_local ? '本地图片' : note.cover_image ? 'CDN图片' : '无图片'
                                        });
                                    });
                                    
                                    const row1 = notes.filter((_, index) => index % 2 === 0);
                                    const row2 = notes.filter((_, index) => index % 2 === 1);
                                    
                                    return (
                                        <>
                                            {row1.length > 0 && (
                                                <div className="notes-row">
                                                    <div className="notes-horizontal-scroll">
                                                        {row1.map((note, index) => (
                                                            <div key={`${note.id}-row1-${index}`} className="note-card-wrapper">
                                                                <XhsNoteCard note={note} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {row2.length > 0 && (
                                                <div className="notes-row">
                                                    <div className="notes-horizontal-scroll">
                                                        {row2.map((note, index) => (
                                                            <div key={`${note.id}-row2-${index}`} className="note-card-wrapper">
                                                                <XhsNoteCard note={note} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default XhsResultsPanel; 