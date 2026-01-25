import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import API_URL from '../config/api';

function QuestionManager() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic_slug: '',
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: 0
  });
  const [csvFile, setCsvFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/quiz/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'DATA_ENTRY_SUCCESSFUL' });
        setFormData({
          topic_slug: '',
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'DATA_ENTRY_FAILED' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'CONNECTION_ERROR' });
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) {
      setMessage({ type: 'error', text: 'NO_FILE_SELECTED' });
      return;
    }

    setLoading(true);
    try {
      Papa.parse(csvFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const questions = results.data
            .filter(row => row.topic_slug && row.question_text)
            .map(row => ({
              topic_slug: row.topic_slug.trim(),
              question_text: row.question_text.trim(),
              options: [
                row.option1 ? row.option1.trim() : '',
                row.option2 ? row.option2.trim() : '',
                row.option3 ? row.option3.trim() : '',
                row.option4 ? row.option4.trim() : ''
              ],
              correct_answer: parseInt(row.correct_answer)
            }));

          if (questions.length === 0) {
            setMessage({ type: 'error', text: 'INVALID_CSV_FORMAT' });
            setLoading(false);
            return;
          }

          try {
            const response = await fetch(`${API_URL}/quiz/questions/bulk`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(questions)
            });

            const data = await response.json();

            if (response.ok) {
              setMessage({
                type: 'success',
                text: `BATCH_PROCESS_COMPLETE: ${data.success} SUCCESS / ${data.failed} FAILED`
              });
            } else {
              setMessage({ type: 'error', text: `UPLOAD_FAILED: ${data.error}` });
            }
          } catch (error) {
            setMessage({ type: 'error', text: 'UPLOAD_ERROR: ' + error.message });
          }
        },
        error: (error) => {
          setMessage({ type: 'error', text: 'CSV_PARSE_ERROR: ' + error.message });
        }
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'FILE_PROCESS_ERROR: ' + error.message });
    } finally {
      setLoading(false);
      setCsvFile(null);
      document.querySelector('input[type="file"]').value = '';
    }
  };

  return (
    <div className="container mx-auto px-6 py-24 max-w-6xl relative">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="flex justify-between items-end mb-10 relative z-10">
        <div>
          <div className="font-mono text-xs text-cyan mb-1">admin_panel</div>
          <h1 className="text-4xl font-sans font-bold text-white tracking-tight">Question Manager</h1>
          <p className="font-mono text-gray-500 text-xs mt-2">DATABASE_WRITE_ACCESS: GRANTED</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-cyan font-mono text-xs uppercase tracking-wider transition-colors"
        >
          &larr; Return_Dashboard
        </button>
      </div>

      {message && (
        <div className={`mb-8 p-4 border flex items-center relative z-10 ${
          message.type === 'success' 
            ? 'bg-green-500/10 border-green-500/50 text-green-400' 
            : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          <span className="font-mono text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        {/* Manual Entry Card */}
        <div className="glass-panel p-1">
          <div className="bg-obsidian/80 p-6 h-full">
            <div className="border-b border-slate pb-4 mb-6">
              <h2 className="font-mono text-cyan text-sm uppercase tracking-wider">
                 Manual_Entry_Protocol
              </h2>
            </div>
            
            <form onSubmit={handleSingleSubmit} className="space-y-6">
              <div>
                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Topic ID</label>
                <input
                  type="text"
                  name="topic_slug"
                  value={formData.topic_slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-charcoal border border-slate text-white focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all font-mono text-sm"
                  placeholder="e.g. docker"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Query Text</label>
                <textarea
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-charcoal border border-slate text-white focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all font-sans"
                  rows="3"
                  placeholder="Enter question content..."
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block font-mono text-xs text-gray-500 uppercase">Variables (Options)</label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <span className="font-mono text-xs text-gray-600 mr-3 w-6">[{index}]</span>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full px-4 py-2 bg-charcoal border border-slate text-white focus:border-cyan outline-none transition-all text-sm"
                      placeholder={`Option value...`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-500 mb-2 uppercase">Correct Index</label>
                <div className="flex space-x-2">
                  {[0, 1, 2, 3].map((val) => (
                    <label key={val} className={`flex-1 text-center py-2 border cursor-pointer transition-all font-mono text-xs ${
                      parseInt(formData.correct_answer) === val 
                        ? 'border-cyan bg-cyan/10 text-cyan' 
                        : 'border-slate text-gray-600 hover:border-gray-500'
                    }`}>
                      <input
                        type="radio"
                        name="correct_answer"
                        value={val}
                        onChange={handleInputChange}
                        checked={parseInt(formData.correct_answer) === val}
                        className="sr-only"
                      />
                      {val}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan text-black font-bold font-mono text-sm py-3 hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'PROCESSING...' : 'INITIATE_UPLOAD'}
              </button>
            </form>
          </div>
        </div>

        {/* Bulk Upload Card */}
        <div className="glass-panel p-1 h-fit">
           <div className="bg-obsidian/80 p-6">
            <div className="border-b border-slate pb-4 mb-6">
              <h2 className="font-mono text-green-500 text-sm uppercase tracking-wider">
                 Bulk_Upload_Protocol
              </h2>
            </div>

            <form onSubmit={handleBulkUpload} className="space-y-6">
              <div className="border border-dashed border-slate hover:border-green-500/50 rounded p-8 text-center transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                  id="csv-upload"
                  required
                />
                <label htmlFor="csv-upload" className="cursor-pointer block">
                  <div className="font-mono text-2xl mb-2 group-hover:scale-110 transition-transform">📄</div>
                  <p className="font-mono text-xs text-gray-400 group-hover:text-green-500 transition-colors">
                    {csvFile ? csvFile.name : 'SELECT_SOURCE_FILE'}
                  </p>
                </label>
              </div>

              <div className="bg-charcoal p-4 border border-slate">
                <h3 className="font-mono text-[10px] text-gray-500 mb-2 uppercase tracking-wider">Schema Requirement</h3>
                <div className="overflow-x-auto">
                  <code className="font-mono text-[10px] text-gray-400 block whitespace-pre">
                    topic_slug,question_text,option1,option2,option3,option4,correct_answer
                  </code>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !csvFile}
                className="w-full bg-slate border border-green-500/30 text-green-500 font-bold font-mono text-sm py-3 hover:bg-green-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'UPLOADING...' : 'EXECUTE_BATCH'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionManager;
