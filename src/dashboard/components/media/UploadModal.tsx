import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader, File as FileIcon, Check, AlertCircle } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Database } from '../../../lib/supabase'
import toast from 'react-hot-toast'

type MediaFile = Database['public']['Tables']['media']['Row']

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadComplete: (files: MediaFile[]) => void
  folder?: string
}

interface FileUpload {
  file: File
  preview?: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
  result?: MediaFile
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  folder
}) => {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const newFiles: FileUpload[] = Array.from(selectedFiles).map(file => {
      const upload: FileUpload = {
        file,
        status: 'pending',
        progress: 0
      }

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFiles(prev => prev.map(f =>
            f.file === file ? { ...f, preview: reader.result as string } : f
          ))
        }
        reader.readAsDataURL(file)
      }

      return upload
    })

    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const uploadedFiles: MediaFile[] = []

    for (let i = 0; i < files.length; i++) {
      const fileUpload = files[i]

      try {
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'uploading', progress: 50 } : f
        ))

        const reader = new FileReader()
        const fileData = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(fileUpload.file)
        })

        const mediaData = {
          filename: `${Date.now()}-${fileUpload.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          original_name: fileUpload.file.name,
          file_path: fileData,
          file_size: fileUpload.file.size,
          mime_type: fileUpload.file.type,
          folder: folder || null
        }

        const { data, error } = await supabase
          .from('media')
          .insert(mediaData)
          .select()
          .single()

        if (error) throw error

        uploadedFiles.push(data)

        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'success', progress: 100, result: data } : f
        ))
      } catch (error: any) {
        console.error('Upload error:', error)
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'error', error: error.message } : f
        ))
      }
    }

    setIsUploading(false)

    if (uploadedFiles.length > 0) {
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`)
      setTimeout(() => {
        onUploadComplete(uploadedFiles)
      }, 1000)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader className="h-5 w-5 animate-spin text-blue-500" />
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileIcon className="h-5 w-5 text-neutral-400" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => !isUploading && onClose()} />
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Upload Files</h2>
              <p className="text-sm text-neutral-600 mt-1">
                {folder ? `Uploading to folder: ${folder}` : 'Upload files to media library'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isUploading}
              className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,application/pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            {files.length === 0 ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-300 hover:border-primary-400'
                }`}
              >
                <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-neutral-900 mb-2">
                  {isDragging ? 'Drop files here' : 'Upload files'}
                </p>
                <p className="text-neutral-600 mb-6">
                  Drag and drop files here, or click to browse
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Choose Files
                </button>
                <p className="text-sm text-neutral-500 mt-4">
                  Supported: Images, Videos, PDFs, Documents
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    {files.length} file(s) selected
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add More Files
                  </button>
                </div>

                <div className="space-y-3">
                  {files.map((fileUpload, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      {fileUpload.preview ? (
                        <img
                          src={fileUpload.preview}
                          alt={fileUpload.file.name}
                          className="w-16 h-16 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-neutral-200 rounded flex items-center justify-center flex-shrink-0">
                          <FileIcon className="h-8 w-8 text-neutral-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {fileUpload.file.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(fileUpload.file.size)}
                        </p>
                        {fileUpload.status === 'uploading' && (
                          <div className="mt-2 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary-600 h-full transition-all duration-300"
                              style={{ width: `${fileUpload.progress}%` }}
                            />
                          </div>
                        )}
                        {fileUpload.status === 'error' && fileUpload.error && (
                          <p className="text-xs text-red-600 mt-1">{fileUpload.error}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {getStatusIcon(fileUpload.status)}
                        {fileUpload.status === 'pending' && (
                          <button
                            onClick={() => removeFile(index)}
                            disabled={isUploading}
                            className="p-1 rounded text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className="border-t border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => !isUploading && setFiles([])}
                  disabled={isUploading}
                  className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear All
                </button>
                <button
                  onClick={uploadFiles}
                  disabled={isUploading || files.every(f => f.status !== 'pending')}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload {files.filter(f => f.status === 'pending').length} Files</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
