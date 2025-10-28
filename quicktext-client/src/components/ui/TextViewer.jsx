import React from 'react'

const TextViewer = ({ theme, textShare, onCopy, onBack }) => {
  if (!textShare) return null

  return (
    <div className={`rounded-xl shadow-lg p-4 sm:p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      {textShare.oneTimeView && (
        <div className={`mb-4 p-3 rounded-lg text-xs sm:text-sm ${
          theme === 'dark' ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-700'
        }`}>
          This is a one-time view share. Navigating away may make it unavailable.
        </div>
      )}

      <div className="mb-4">
        <h2 className={`text-base sm:text-lg font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          Shared Text
        </h2>
        <div className={`p-3 sm:p-4 rounded-lg border ${
          theme === 'dark' 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-gray-50 border-gray-200 text-gray-900'
        }`}>
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {textShare.content}
          </pre>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between mb-4">
        <div className={`text-xs sm:text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <p>Share ID: {textShare.customLink || textShare.shareId}</p>
          <p>Views: {textShare.viewCount || 0}</p>
          <p>Created: {textShare.createdAt ? new Date(textShare.createdAt).toLocaleString() : '-'}</p>
          {textShare.expiresAt && (
            <p>Expires: {new Date(textShare.expiresAt).toLocaleString()}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopy}
            className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs sm:text-sm"
          >
            Copy Link
          </button>
          <button
            onClick={onBack}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm ${
              theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default TextViewer


