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
        setMessage({ type: 'success', text: 'Question added successfully!' });
        setFormData({
          topic_slug: '',
          question_text: '',
          options: ['', '', '', ''],
          correct_answer: 0
        });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add question' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding question' });
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
      setMessage({ type: 'error', text: 'Please select a CSV file' });
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
            setMessage({ type: 'error', text: 'No valid questions found in CSV file' });
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
                text: `Successfully added ${data.success} questions. Failed: ${data.failed}`
              });
            } else {
              setMessage({ type: 'error', text: `Upload failed: ${data.error}` });
            }
          } catch (error) {
            setMessage({ type: 'error', text: 'Error uploading questions: ' + error.message });
          }
        },
        error: (error) => {
          setMessage({ type: 'error', text: 'Error parsing CSV: ' + error.message });
        }
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error processing file: ' + error.message });
    } finally {
      setLoading(false);
      setCsvFile(null);
      document.querySelector('input[type="file"]').value = '';
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Question Manager</h1>
          <p className="text-gray-500 mt-2 text-lg">Curate your content database</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl shadow-sm border-l-4 flex items-center ${
          message.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <span className="text-2xl mr-3">{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span className="font-medium whitespace-pre-wrap">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Manual Entry Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="bg-white/20 p-2 rounded-lg mr-3">✍️</span>
              Manual Entry
            </h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleSingleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Topic Slug</label>
                <input
                  type="text"
                  name="topic_slug"
                  value={formData.topic_slug}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  placeholder="e.g. docker, kubernetes"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Question Text</label>
                <textarea
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                  rows="3"
                  placeholder="What is the meaning of life?"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Options</label>
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-sm"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correct Answer Index</label>
                <div className="flex space-x-4">
                  {[0, 1, 2, 3].map((val) => (
                    <label key={val} className={`flex-1 text-center py-2 rounded-lg border-2 cursor-pointer transition-all ${
                      parseInt(formData.correct_answer) === val 
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' 
                        : 'border-gray-200 text-gray-500 hover:border-blue-200'
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
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transform active:scale-95 transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Add Question'}
              </button>
            </form>
          </div>
        </div>

        {/* Bulk Upload Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-fit">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="bg-white/20 p-2 rounded-lg mr-3">📂</span>
              Bulk Upload
            </h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleBulkUpload} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                  id="csv-upload"
                  required
                />
                <label htmlFor="csv-upload" className="cursor-pointer block">
                  <div className="text-4xl mb-3">📄</div>
                  <p className="font-medium text-gray-700">
                    {csvFile ? csvFile.name : 'Click to upload CSV'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">.csv files only</p>
                </label>
              </div>

              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Required CSV Format</h3>
                <div className="overflow-x-auto">
                  <code className="text-xs bg-white p-3 rounded border border-gray-200 block whitespace-pre text-gray-600">
                    topic_slug,question_text,option1,option2,option3,option4,correct_answer
                  </code>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p className="mb-1">Example:</p>
                  <code className="text-emerald-700">
                    docker,What is a container?,VM,Process,App,Box,1
                  </code>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !csvFile}
                className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transform active:scale-95 transition-all shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Uploading...' : 'Upload CSV'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionManager;