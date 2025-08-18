import React, { useState, useEffect } from 'react';
import { Input, Button, AutoComplete, Row, Col, message, Spin, Tag, Popconfirm, Alert } from 'antd';
import { API_PATHS } from '../configs/env';
import XhsNoteCard from './Chat/components/XhsNoteCard';

const categoryOptions = [
    { value: "经验方法类" },
    { value: "认知提升类" },
    { value: "好物合集类" },
    { value: "体验类" },
    { value: "记录成长类" }
];

const categoryDescriptions = {
    "经验方法类": (
        <div>
            <p><b>核心：</b>直接给干货，为用户提供明确的解决方案。</p>
            <p><b>思考路径：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><b>洞察人群：</b>清晰地知道你的内容是给谁看的。</li>
                <li><b>聚焦痛点：</b>思考这类人群最关心、最头疼的问题是什么。</li>
                <li><b>提供方案：</b>给出一个听起来非常有效、吸引人的解决方案。</li>
            </ul>
            <p><b>新手模仿路径：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>在小红书直接搜索用户“痛点”关键词。</li>
                <li>分析搜索结果中的爆款笔记，看它们是如何做的。</li>
                <li>模仿并组合爆款的标题和内容结构。</li>
            </ul>
            <p><b>标题示例：</b>“小红书27w粉丝，分享我的7天起号流程”、“10000人看过我啦，我的7天起号流程”。这类标题直接展示成果和方法，吸引有同样需求的用户点击。</p>
        </div>
    ),
    "认知提升类": (
        <div>
            <p><b>核心：</b>改变或挑战大众普遍认知，通过反向思维制造冲击感。</p>
            <p><b>创作技巧：</b>学会“正话反说”，提出一个看似矛盾但又能自圆其说的观点，如果能达到“冲击三观”的效果，标题就算成功了。</p>
            <p><b>标题示例：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>“我的省钱原则：只买贵的”</li>
                <li>“有野心的女孩，才是真的会搞钱”</li>
                <li>“二胎这碗水，我从一开始就没想端平”</li>
                <li>“我超会读书，因为我只记一句”</li>
            </ul>
            <p>这类标题通过制造强烈的感官和认知对比，能有效激发用户的好奇心。</p>
        </div>
    ),
    "好物合集类": (
        <div>
            <p><b>核心：</b>为用户提供高效的“整理价值”，将某一主题下的优质内容整合到一起。这是新手非常容易上手的选题方向。</p>
            <p><b>创作方向：</b>万物皆可整理，如图书、电影、App、副业、育儿经验等。</p>
            <p><b>标题要点：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li><b>突出“全”：</b>让用户感觉看你一篇就够了，如：“史上最全”、“年度盘点”。</li>
                <li><b>突出“精”：</b>让用户感觉你提供的内容是精挑细选的，如：“知道这几个就够了”、“N个高质量XX”。</li>
            </ul>
        </div>
    ),
    "体验类": (
        <div>
            <p><b>核心：</b>通过分享个人独特或有趣的经历，来满足用户的好奇心。</p>
            <p><b>思考路径：</b>“我有什么样的亲身经历，是别人可能很好奇但没体验过的？”</p>
            <p><b>创作技巧：</b>不一定非要以“第一次”开头，关键在于挖掘经历中能激发好奇心的点。</p>
            <p><b>标题示例：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>“第一次坐飞机头等舱是什么体验？”</li>
                <li>“不上班的第三年，我自律上瘾了”（引发对“不上班”和“自律”的好奇）</li>
                <li>“聊聊我辞职这一年都经历了什么”（引发对“辞职”生活的好奇）</li>
            </ul>
        </div>
    ),
    "记录成长类": (
        <div>
            <p><b>核心：</b>通过连续记录个人在某个领域的努力和成长，引发用户的持续好奇和共鸣。</p>
            <p><b>内容价值：</b>这种形式能给用户带来“陪伴感”，通过分享自己的学习过程和成果，既提供了情绪价值，也提供了干货价值（帮别人节省时间）。</p>
            <p><b>标题技巧：</b>在标题前加上自己的年龄或身份标签，更容易吸引到精准人群。</p>
            <p><b>标题示例：</b></p>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>“全职妈妈，学做自媒体的第一天”</li>
                <li>“32岁，学做自媒体的第一天”</li>
                <li>“二胎妈妈，在家减肥的第一天”</li>
            </ul>
        </div>
    )
};


const CategorizedNotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noteUrl, setNoteUrl] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0].value);
    const [filterCategory, setFilterCategory] = useState(categoryOptions[0].value);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    useEffect(() => {
        fetchNotes(filterCategory);
    }, [filterCategory]);

    const handleFilterChange = (category) => {
        setFilterCategory(category);
        setIsDescriptionExpanded(false);
    };

    const fetchNotes = async (category) => {
        setLoading(true);
        try {
            let url = `${API_PATHS.CATEGORIZED_NOTES}/get-categorized-notes`;
            if (category) {
                url += `?category=${encodeURIComponent(category)}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                console.log(`📊 [CategorizedNotesPage] 获取分类笔记成功:`, {
                    category: category,
                    totalNotes: result.data.length,
                    notesWithLocalCover: result.data.filter(note => note.cover_image_local).length,
                    notesWithCdnCover: result.data.filter(note => note.cover_image && !note.cover_image_local).length,
                    notesWithLocalImages: result.data.filter(note => note.images_local?.length > 0).length,
                    notesWithCdnImages: result.data.filter(note => note.images?.length > 0).length
                });
                
                // 详细打印前3个笔记的图片信息
                result.data.slice(0, 3).forEach((note, index) => {
                    console.log(`📝 [CategorizedNotesPage] 分类笔记 ${index + 1} (${note.id}) 图片详情:`, {
                        title: note.display_title?.substring(0, 20) + '...',
                        category: note.category,
                        hasCoverImageLocal: !!note.cover_image_local,
                        coverImageLocal: note.cover_image_local,
                        hasCoverImage: !!note.cover_image,
                        coverImage: note.cover_image,
                        hasImagesLocal: !!(note.images_local?.length > 0),
                        hasImages: !!(note.images?.length > 0),
                        preferredSource: note.cover_image_local ? '本地图片' : note.cover_image ? 'CDN图片' : '无图片'
                    });
                });
                
                setNotes(result.data);
            } else {
                message.error('Failed to fetch notes');
            }
        } catch (error) {
            message.error('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!noteUrl || !selectedCategory) {
            message.warning('Please enter a note URL and select a category');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_PATHS.CATEGORIZED_NOTES}/add-categorized-note`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note_url: noteUrl, category: selectedCategory }),
            });
            const result = await response.json();
            if (result.success) {
                message.success('Note added successfully');
                setNoteUrl('');
                fetchNotes(filterCategory);
            } else {
                message.error(result.detail || 'Failed to add note');
            }
        } catch (error) {
            message.error('Failed to add note');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const response = await fetch(`${API_PATHS.CATEGORIZED_NOTES}/delete-categorized-note/${noteId}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
                message.success('Note deleted successfully');
                fetchNotes(filterCategory); // Refresh notes after deletion
            } else {
                message.error(result.detail || 'Failed to delete note');
            }
        } catch (error) {
            message.error('Failed to delete note');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>小红书笔记</h1>
            <div style={{ marginBottom: '20px' }}>
                <Input
                    placeholder="粘贴小红书笔记链接"
                    value={noteUrl}
                    onChange={(e) => setNoteUrl(e.target.value)}
                    style={{ width: '300px', marginRight: '10px' }}
                />
                <AutoComplete
                    value={selectedCategory}
                    options={categoryOptions}
                    style={{ width: 150, marginRight: '10px' }}
                    onSelect={(value) => setSelectedCategory(value)}
                    onSearch={(text) => setSelectedCategory(text)}
                    onChange={(text) => setSelectedCategory(text)}
                    placeholder="选择或输入分类"
                />
                <Button type="primary" onClick={handleAddNote} loading={loading}>添加</Button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <span style={{ marginRight: 8 }}>筛选:</span>
                {categoryOptions.map(cat => (
                    <Tag.CheckableTag
                        key={cat.value}
                        checked={filterCategory === cat.value}
                        onChange={() => handleFilterChange(cat.value)}
                    >
                        {cat.value}
                    </Tag.CheckableTag>
                ))}
            </div>

            {filterCategory && (
                <div style={{ marginBottom: '20px' }}>
                    <Alert
                        message={`${filterCategory} - 创作建议`}
                        description={
                            <div>
                                <div style={{
                                    maxHeight: isDescriptionExpanded ? '1000px' : '52px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    transition: 'max-height 0.4s ease'
                                }}>
                                    {categoryDescriptions[filterCategory]}
                                    {!isDescriptionExpanded && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '24px',
                                            background: 'linear-gradient(to top, rgba(230, 247, 255, 1), transparent)'
                                        }} />
                                    )}
                                </div>
                                <Button
                                    type="link"
                                    onClick={() => setIsDescriptionExpanded(prev => !prev)}
                                    style={{ padding: '5px 0 0 0', lineHeight: 1 }}
                                >
                                    {isDescriptionExpanded ? '收起' : '...展开阅读'}
                                </Button>
                            </div>
                        }
                        type="info"
                        showIcon
                        closable
                        onClose={() => setFilterCategory('')}
                    />
                </div>
            )}

            <Spin spinning={loading}>
                <Row gutter={[16, 16]}>
                    {notes.map(note => (
                        <Col 
                            key={note.id} 
                            xs={12} sm={8} md={6} lg={4} xl={4}
                        >
                            <XhsNoteCard note={note} onDelete={() => handleDeleteNote(note.id)} />
                        </Col>
                    ))}
                </Row>
            </Spin>
        </div>
    );
};

export default CategorizedNotesPage;
