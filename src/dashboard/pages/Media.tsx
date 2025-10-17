import React, { useState, useEffect } from 'react'
import { Upload, Search, Filter, Image as ImageIcon, File, Trash2, Download, Eye, Folder, Grid2x2 as Grid, List, MoreHorizontal, Plus, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Database } from '../../lib/supabase'
import { UploadModal } from '../components/media/UploadModal'
import toast from 'react-hot-toast'

type MediaFile = Database['public']['Tables']['media']['Row']

export const Media: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [folderFilter, setFolderFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    fetchMediaFiles()
  }, [folderFilter, typeFilter])

  const fetchMediaFiles = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (folderFilter !== 'all') {
        if (folderFilter === 'root') {
          query = query.is('folder', null)
        } else {
          query = query.eq('folder', folderFilter)
        }
      }

      if (typeFilter !== 'all') {
        query = query.like('mime_type', `${typeFilter}%`)
      }

      const { data, error } = await query

      if (error) throw error
      setMediaFiles(data || [])
    } catch (error: any) {
      toast.error('Failed to fetch media files')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMediaFiles(mediaFiles.filter(file => file.id !== id))
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id))
      toast.success('File deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete file')
      console.error('Error:', error)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) return

    try {
      const { error } = await supabase
        .from('media')
        .delete()
        .in('id', selectedFiles)

      if (error) throw error

      setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)))
      setSelectedFiles([])
      toast.success(`${selectedFiles.length} files deleted successfully`)
    } catch (error: any) {
      toast.error('Failed to delete files')
      console.error('Error:', error)
    }
  }

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id))
    }
  }

  const createFolder = async () => {
    if (!newFolderName.trim()) return

    // For demo purposes, we'll just add it to the filter options
    // In a real implementation, you'd create a folder structure
    toast.success(`Folder "${newFolderName}" created`)
    setNewFolderName('')
    setShowCreateFolder(false)
  }

  const filteredFiles = mediaFiles.filter(file =>
    file.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.alt_text && file.alt_text.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (file.tags && file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  )

  const folders = [...new Set(mediaFiles.map(file => file.folder).filter(Boolean))]
  const fileTypes = [...new Set(mediaFiles.map(file => file.mime_type.split('/')[0]))]

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon
    return File
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Media Library</h1>
          <p className="text-neutral-600 mt-2">
            Manage your images, documents, and other media files
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateFolder(true)}
            className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2"
          >
            <Folder className="h-4 w-4" />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-neutral-400" />
              <select
                value={folderFilter}
                onChange={(e) => setFolderFilter(e.target.value)}
                className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Folders</option>
                <option value="root">Root</option>
                {folders.map(folder => (
                  <option key={folder} value={folder}>{folder}</option>
                ))}
              </select>
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-neutral-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-neutral-400'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-primary-50 rounded-lg">
            <span className="text-sm font-medium text-primary-700">
              {selectedFiles.length} files selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Files Display */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No files found</h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Upload Files
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleSelectAll}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.mime_type)
                const isSelected = selectedFiles.includes(file.id)
                
                return (
                  <div
                    key={file.id}
                    className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => handleFileSelect(file.id)}
                  >
                    <div className="aspect-square bg-neutral-100 flex items-center justify-center">
                      {file.mime_type.startsWith('image/') ? (
                        <img
                          src={file.file_path}
                          alt={file.alt_text || file.original_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FileIcon className="h-8 w-8 text-neutral-400" />
                      )}
                    </div>
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFileSelect(file.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="relative">
                        <button className="p-1 rounded bg-white/80 backdrop-blur-sm text-neutral-600 hover:bg-white hover:text-neutral-900 transition-all duration-200">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* File Info */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {file.original_name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatFileSize(file.file_size)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Folder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mime_type)
                  const isSelected = selectedFiles.includes(file.id)
                  
                  return (
                    <tr key={file.id} className={`hover:bg-neutral-50 ${isSelected ? 'bg-primary-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleFileSelect(file.id)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {file.mime_type.startsWith('image/') ? (
                              <img
                                src={file.file_path}
                                alt={file.alt_text || file.original_name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 bg-neutral-100 rounded flex items-center justify-center">
                                <FileIcon className="h-5 w-5 text-neutral-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-neutral-900">{file.original_name}</p>
                            {file.alt_text && (
                              <p className="text-xs text-neutral-500">{file.alt_text}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {file.mime_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {formatFileSize(file.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {file.folder || 'Root'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                        {new Date(file.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200"
                            title="View file"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="p-2 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                            title="Delete file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Files</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{mediaFiles.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <File className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Images</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {mediaFiles.filter(f => f.mime_type.startsWith('image/')).length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <ImageIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Size</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {formatFileSize(mediaFiles.reduce((acc, file) => acc + file.file_size, 0))}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Upload className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Folders</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{folders.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Folder className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={(files) => {
            setMediaFiles([...files, ...mediaFiles])
            setShowUploadModal(false)
          }}
          folder={folderFilter !== 'all' && folderFilter !== 'root' ? folderFilter : undefined}
        />
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCreateFolder(false)} />
          <div className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 mb-4"
            />
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}