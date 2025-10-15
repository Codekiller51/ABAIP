import React, { useState, useRef } from 'react'
import { Upload, X, Loader, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  currentUrl?: string
  onImageSelect: (url: string) => void
  onClose: () => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onImageSelect,
  onClose
}) => {
  const [imageUrl, setImageUrl] = useState(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast.error('Please enter an image URL')
      return
    }

    try {
      new URL(imageUrl)
      onImageSelect(imageUrl)
      toast.success('Image URL set successfully')
      onClose()
    } catch {
      toast.error('Please enter a valid URL')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setImageUrl(base64String)
      onImageSelect(base64String)
      toast.success('Image loaded successfully')
      setUploading(false)
      onClose()
    }
    reader.onerror = () => {
      toast.error('Failed to read image file')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Add Image</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Image URL
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/image.jpg"
              />
              <button
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-neutral-500">
              Enter a direct URL to an image
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">Or</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Upload Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Click to upload</span>
                </>
              )}
            </button>
            <p className="mt-1 text-xs text-neutral-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Preview
              </label>
              <div className="relative rounded-lg overflow-hidden border border-neutral-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={() => toast.error('Failed to load image')}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
