import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:9000/api/lightrag';

const LightRAGPage = () => {
  const [documents, setDocuments] = useState('');
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('hybrid');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [entities, setEntities] = useState([]);
  const [relations, setRelations] = useState([]);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/status`);
      setServerStatus(response.data);
    } catch (err) {
      setServerStatus({ status: 'error', connected: false, error: err.message });
    }
  };

  const handleInsert = async () => {
    if (!documents.trim()) {
      setError('Please enter documents to insert.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const docs = documents.split('\n').filter(doc => doc.trim() !== '');
      const response = await axios.post(`${API_URL}/insert`, { documents: docs });
      setResult(response.data);
      setDocuments(''); // 清空输入
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during insertion.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a query.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post(`${API_URL}/query`, { 
        query, 
        mode,
        top_k: 10
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during query.');
    } finally {
      setLoading(false);
    }
  };

  const loadEntities = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/entities`);
      setEntities(response.data.entities || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load entities.');
    } finally {
      setLoading(false);
    }
  };

  const loadRelations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/relations`);
      setRelations(response.data.relations || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load relations.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEntity = async (entityName) => {
    // 使用 window.confirm 来避免 ESLint 错误
    if (!window.confirm(`Are you sure you want to delete entity "${entityName}"?`)) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/entity/${encodeURIComponent(entityName)}`);
      setResult({ message: `Entity "${entityName}" deleted successfully` });
      loadEntities(); // 重新加载实体列表
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete entity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">LightRAG Integration</h1>

      {/* 服务器状态 */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Server Status</h2>
          <button
            onClick={checkServerStatus}
            className="px-3 py-1 bg-gray-500 hover:bg-gray-700 text-white rounded text-sm"
          >
            Refresh
          </button>
        </div>
        {serverStatus && (
          <div className={`mt-2 p-2 rounded ${
            serverStatus.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Status: {serverStatus.connected ? '✅ Connected' : '❌ Disconnected'}
            {serverStatus.error && <div className="text-sm">Error: {serverStatus.error}</div>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：数据操作 */}
        <div className="space-y-6">
          {/* 插入文档 */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl mb-2">1. Insert Documents</h2>
            <p className="text-gray-600 mb-4">Enter documents to be indexed by LightRAG. Each line will be treated as a separate document.</p>
            <textarea
              className="w-full h-32 p-2 border rounded"
              value={documents}
              onChange={(e) => setDocuments(e.target.value)}
              placeholder="Enter documents, one per line..."
            />
            <button
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={handleInsert}
              disabled={loading}
            >
              {loading ? 'Inserting...' : 'Insert'}
            </button>
          </div>

          {/* 查询 */}
          <div className="bg-white shadow-md rounded p-6">
            <h2 className="text-xl mb-2">2. Query</h2>
            <p className="text-gray-600 mb-4">Ask a question to the indexed documents.</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Query Mode:</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="hybrid">Hybrid (Recommended)</option>
                <option value="local">Local</option>
                <option value="global">Global</option>
                <option value="naive">Naive</option>
                <option value="mix">Mix</option>
              </select>
            </div>

            <input
              type="text"
              className="w-full p-2 border rounded"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query..."
            />
            <button
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              onClick={handleQuery}
              disabled={loading}
            >
              {loading ? 'Querying...' : 'Query'}
            </button>
          </div>
        </div>

        {/* 右侧：知识图谱管理 */}
        <div className="space-y-6">
          {/* 实体管理 */}
          <div className="bg-white shadow-md rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">3. Entities</h2>
              <button
                onClick={loadEntities}
                className="px-3 py-1 bg-purple-500 hover:bg-purple-700 text-white rounded text-sm"
                disabled={loading}
              >
                Load Entities
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {entities.length > 0 ? (
                entities.slice(0, 10).map((entity, index) => (
                  <div key={index} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-sm truncate">{entity.name || entity}</span>
                    <button
                      onClick={() => deleteEntity(entity.name || entity)}
                      className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded text-xs"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No entities loaded. Click "Load Entities" to view.</p>
              )}
            </div>
          </div>

          {/* 关系管理 */}
          <div className="bg-white shadow-md rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl">4. Relations</h2>
              <button
                onClick={loadRelations}
                className="px-3 py-1 bg-indigo-500 hover:bg-indigo-700 text-white rounded text-sm"
                disabled={loading}
              >
                Load Relations
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {relations.length > 0 ? (
                relations.slice(0, 10).map((relation, index) => (
                  <div key={index} className="py-1 px-2 hover:bg-gray-50 rounded">
                    <span className="text-sm">{relation.source} → {relation.target}</span>
                    <div className="text-xs text-gray-500">{relation.description}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No relations loaded. Click "Load Relations" to view.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* 结果显示 */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap break-all text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {/* 帮助信息 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="text-lg font-semibold mb-2">How to use:</h3>
        <ol className="list-decimal list-inside text-sm space-y-1">
          <li>Make sure the LightRAG server is running (check server status above)</li>
          <li>Insert some documents using the "Insert Documents" section</li>
          <li>Query the knowledge base using the "Query" section</li>
          <li>Explore entities and relations in the knowledge graph</li>
          <li>Use different query modes for different types of questions</li>
        </ol>
      </div>
    </div>
  );
};

export default LightRAGPage;