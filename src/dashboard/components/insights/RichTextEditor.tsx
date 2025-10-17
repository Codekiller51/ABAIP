import React, { useMemo, useRef } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  error?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write your content here...',
  error
}) => {
  const quillRef = useRef<ReactQuill>(null)

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link', 'blockquote', 'code-block'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean']
      ],
      clipboard: {
        matchVisual: false
      }
    }),
    []
  )

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    'blockquote',
    'code-block',
    'color',
    'background',
    'align'
  ]

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className={`bg-white rounded-xl border-2 transition-all duration-200 ${
          error
            ? 'border-red-300 focus-within:border-red-500'
            : 'border-neutral-300 focus-within:border-primary-500'
        }`}
        style={{ minHeight: '300px' }}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <style>{`
        .rich-text-editor-wrapper .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          border: none;
          border-bottom: 2px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
        }

        .rich-text-editor-wrapper .ql-container {
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          border: none;
          font-family: inherit;
          font-size: 15px;
          min-height: 300px;
        }

        .rich-text-editor-wrapper .ql-editor {
          min-height: 300px;
          padding: 16px;
        }

        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }

        .rich-text-editor-wrapper .ql-snow .ql-stroke {
          stroke: #374151;
        }

        .rich-text-editor-wrapper .ql-snow .ql-fill {
          fill: #374151;
        }

        .rich-text-editor-wrapper .ql-snow .ql-picker-label {
          color: #374151;
        }

        .rich-text-editor-wrapper .ql-toolbar button:hover,
        .rich-text-editor-wrapper .ql-toolbar button:focus,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active {
          color: #ea580c;
        }

        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button:focus .ql-stroke,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #ea580c;
        }

        .rich-text-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button:focus .ql-fill,
        .rich-text-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #ea580c;
        }

        .rich-text-editor-wrapper .ql-snow a {
          color: #ea580c;
        }

        .rich-text-editor-wrapper .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .rich-text-editor-wrapper .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .rich-text-editor-wrapper .ql-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }

        .rich-text-editor-wrapper .ql-editor p {
          margin-bottom: 1em;
          line-height: 1.6;
        }

        .rich-text-editor-wrapper .ql-editor ul,
        .rich-text-editor-wrapper .ql-editor ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }

        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid #ea580c;
          padding-left: 16px;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          color: #6b7280;
        }

        .rich-text-editor-wrapper .ql-editor code {
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        .rich-text-editor-wrapper .ql-editor pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  )
}
