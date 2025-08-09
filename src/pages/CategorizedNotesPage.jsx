import React, { useState, useEffect } from 'react';
import { Input, Button, AutoComplete, Row, Col, message, Spin, Tag, Popconfirm } from 'antd';
import { API_PATHS } from '../configs/env';
import XhsNoteCard from './Chat/components/XhsNoteCard';

const categoryOptions = [
    { value: "经验方法类" },
    { value: "认知提升类" },
    { value: "好物合集类" },
    { value: "体验类" },
    { value: "记录成长类" }
];

const CategorizedNotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noteUrl, setNoteUrl] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0].value);
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        fetchNotes(filterCategory);
    }, [filterCategory]);

    const fetchNotes = async (category) => {
        setLoading(true);
        try {
            let url = `${API_PATHS.CATEGORIZED_NOTES}/get-categorized-notes`;
            if (category && category !== 'all') {
                url += `?category=${encodeURIComponent(category)}`;
            }
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
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
                <Tag.CheckableTag
                    checked={filterCategory === 'all'}
                    onChange={() => setFilterCategory('all')}
                >
                    全部
                </Tag.CheckableTag>
                {categoryOptions.map(cat => (
                    <Tag.CheckableTag
                        key={cat.value}
                        checked={filterCategory === cat.value}
                        onChange={() => setFilterCategory(cat.value)}
                    >
                        {cat.value}
                    </Tag.CheckableTag>
                ))}
            </div>

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
