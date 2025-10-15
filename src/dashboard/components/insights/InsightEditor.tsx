import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  X,
  Save,
  Eye,
  Image,
  Tag,
  Calendar,
  Globe,
  FileText,
  Star,
  Clock,
  Send,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Code
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Database } from '../../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'
import { ImageUploader } from './ImageUploader'
import toast from 'react-hot-toast'

type Insight = Database['public']['Tables']['insights']['Row']
type InsightInsert = Database['public']['Tables']['insights']['Insert']

const schema = yup.object({
  title: yup.string().required('Title is required').max(200, 'Title must be less than 200 characters'),
  summary: yup.string().required('Summary is required').max(500, 'Summary must be less than 500 characters'),
  content: yup.string().required('Content is required'),
  author: yup.string().required('Author is required'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  meta_title: yup.string().max(60, 'Meta title should be less than 60 characters'),
  meta_description: yup.string().max(160, 'Meta description should be less than 160 characters'),
  image_url: yup.string().url('Must be a valid URL').nullable(),
  categories: yup.array().of(yup.string()),
  tags: yup.array().of(yup.string()),
  keywords: yup.array().of(yup.string()),
  scheduled_publish_at: yup.string().nullable(),
})

type FormData = yup.InferType<typeof schema>

interface InsightEditorProps {
  insight?: Insight | null
  isOpen: boolean
  onClose: () => void
  onSave: (insight: Insight) => void
}

export const InsightEditor: React.FC<InsightEditorProps> = ({
  insight,
  isOpen,
  onClose,
  onSave
}) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categoryInput, setCategoryInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [schedulePublish, setSchedulePublish] = useState(false)
  const [publishAction, setPublishAction] = useState<'draft' | 'publish' | 'schedule'>('draft')
  const [showImageUploader, setShowImageUploader] = useState(false)

  const {
    register,
    handleSubmit: formHandleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      author: '',
      slug: '',
      meta_title: '',
      meta_description: '',
      image_url: '',
      categories: [],
      tags: [],
      keywords: [],
      scheduled_publish_at: ''
    }
  })

  const watchedTitle = watch('title')
  const watchedCategories = watch('categories') || []
  const watchedTags = watch('tags') || []
  const watchedKeywords = watch('keywords') || []

  useEffect(() => {
    if (insight) {
      reset({
        title: insight.title,
        summary: insight.summary,
        content: insight.content,
        author: insight.author,
        slug: insight.slug,
        meta_title: insight.meta_title || '',
        meta_description: insight.meta_description || '',
        image_url: insight.image_url || '',
        categories: insight.categories || [],
        tags: insight.tags || [],
        keywords: insight.keywords || [],
        scheduled_publish_at: ''
      })
      if (insight.published_at && insight.status === 'draft') {
        setSchedulePublish(true)
        const scheduledDate = new Date(insight.published_at)
        setValue('scheduled_publish_at', scheduledDate.toISOString().slice(0, 16))
      }
    } else {
      reset({
        title: '',
        summary: '',
        content: '',
        author: '',
        slug: '',
        meta_title: '',
        meta_description: '',
        image_url: '',
        categories: [],
        tags: [],
        keywords: [],
        scheduled_publish_at: ''
      })
      setSchedulePublish(false)
      if (user) {
        setValue('author', `${user.first_name} ${user.last_name}`)
      }
    }
  }, [insight, reset, user, setValue])

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !insight) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug)
    }
  }, [watchedTitle, setValue, insight])

  const handleSubmit = async (data: FormData, action: 'draft' | 'publish' | 'schedule') => {
    try {
      setIsSubmitting(true)

      let status: 'draft' | 'published' | 'archived' = 'draft'
      let publishedAt: string | null = null

      if (action === 'publish') {
        status = 'published'
        publishedAt = new Date().toISOString()
      } else if (action === 'schedule' && data.scheduled_publish_at) {
        status = 'draft'
        publishedAt = new Date(data.scheduled_publish_at).toISOString()
      }

      const insightData: InsightInsert = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        slug: data.slug,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        image_url: data.image_url || null,
        categories: data.categories || [],
        tags: data.tags || [],
        keywords: data.keywords || [],
        status,
        published_at: publishedAt,
        featured: insight?.featured || false
      }

      let result
      if (insight) {
        // Update existing insight
        result = await supabase
          .from('insights')
          .update(insightData)
          .eq('id', insight.id)
          .select()
          .single()
      } else {
        // Create new insight
        result = await supabase
          .from('insights')
          .insert(insightData)
          .select()
          .single()
      }

      if (result.error) throw result.error

      const actionMessage = action === 'publish'
        ? 'published'
        : action === 'schedule'
        ? 'scheduled for publishing'
        : 'saved as draft'

      toast.success(`Insight ${actionMessage} successfully`)
      onSave(result.data)
      onClose()
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('A post with this slug already exists')
      } else {
        toast.error('Failed to save insight')
      }
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = (data: FormData) => {
    handleSubmit(data, publishAction)
  }

  const insertFormatting = (tag: string, textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const beforeText = textarea.value.substring(0, start)
    const afterText = textarea.value.substring(end)

    let newText = ''
    let cursorOffset = 0

    switch(tag) {
      case 'bold':
        newText = `${beforeText}<strong>${selectedText}</strong>${afterText}`
        cursorOffset = selectedText ? 0 : 8
        break
      case 'italic':
        newText = `${beforeText}<em>${selectedText}</em>${afterText}`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'h2':
        newText = `${beforeText}<h2>${selectedText}</h2>${afterText}`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'h3':
        newText = `${beforeText}<h3>${selectedText}</h3>${afterText}`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'ul':
        newText = `${beforeText}<ul>\n  <li>${selectedText}</li>\n</ul>${afterText}`
        cursorOffset = selectedText ? 0 : 10
        break
      case 'link':
        newText = `${beforeText}<a href="">${selectedText}</a>${afterText}`
        cursorOffset = selectedText ? -selectedText.length - 4 : 2
        break
      case 'code':
        newText = `${beforeText}<code>${selectedText}</code>${afterText}`
        cursorOffset = selectedText ? 0 : 6
        break
    }

    setValue('content', newText)
    setTimeout(() => {
      textarea.focus()
      const newPosition = selectedText ? end + (newText.length - textarea.value.length) : start + tag.length + cursorOffset
      textarea.setSelectionRange(newPosition, newPosition)
    }, 0)
  }

  const addCategory = () => {
    if (categoryInput.trim() && !watchedCategories.includes(categoryInput.trim())) {
      setValue('categories', [...watchedCategories, categoryInput.trim()])
      setCategoryInput('')
    }
  }

  const removeCategory = (category: string) => {
    setValue('categories', watchedCategories.filter(c => c !== category))
  }

  const addTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setValue('tags', watchedTags.filter(t => t !== tag))
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !watchedKeywords.includes(keywordInput.trim())) {
      setValue('keywords', [...watchedKeywords, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setValue('keywords', watchedKeywords.filter(k => k !== keyword))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-4xl w-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {insight ? 'Edit Insight' : 'Create New Insight'}
              </h2>
              <p className="text-sm text-neutral-600 mt-1">
                {insight ? 'Update your existing insight' : 'Create a new blog post or article'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-neutral-200">
            {[
              { id: 'content', label: 'Content', icon: FileText },
              { id: 'seo', label: 'SEO', icon: Globe },
              { id: 'settings', label: 'Settings', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Title *
                    </label>
                    <input
                      {...register('title')}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter insight title..."
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Slug *
                    </label>
                    <input
                      {...register('slug')}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="url-friendly-slug"
                    />
                    {errors.slug && (
                      <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                    )}
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Author *
                    </label>
                    <input
                      {...register('author')}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Author name"
                    />
                    {errors.author && (
                      <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
                    )}
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Summary *
                    </label>
                    <textarea
                      {...register('summary')}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Brief summary of the insight..."
                    />
                    {errors.summary && (
                      <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Content *
                    </label>

                    {/* Formatting Toolbar */}
                    <div className="flex items-center space-x-1 mb-2 p-2 bg-neutral-50 border border-neutral-300 rounded-lg">
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('bold', textarea)
                        }}
                        className="p-2 rounded hover:bg-neutral-200 transition-colors"
                        title="Bold"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('italic', textarea)
                        }}
                        className="p-2 rounded hover:bg-neutral-200 transition-colors"
                        title="Italic"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <div className="w-px h-6 bg-neutral-300 mx-1" />
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('h2', textarea)
                        }}
                        className="px-2 py-1 rounded hover:bg-neutral-200 transition-colors text-sm font-semibold"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('h3', textarea)
                        }}
                        className="px-2 py-1 rounded hover:bg-neutral-200 transition-colors text-sm font-semibold"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <div className="w-px h-6 bg-neutral-300 mx-1" />
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('ul', textarea)
                        }}
                        className="p-2 rounded hover:bg-neutral-200 transition-colors"
                        title="Bullet List"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('link', textarea)
                        }}
                        className="p-2 rounded hover:bg-neutral-200 transition-colors"
                        title="Link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
                          insertFormatting('code', textarea)
                        }}
                        className="p-2 rounded hover:bg-neutral-200 transition-colors"
                        title="Code"
                      >
                        <Code className="h-4 w-4" />
                      </button>
                    </div>

                    <textarea
                      {...register('content')}
                      id="content-textarea"
                      rows={12}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                      placeholder="Write your insight content here... (HTML supported)"
                    />
                    {errors.content && (
                      <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Featured Image URL
                    </label>
                    <div className="flex space-x-2">
                      <input
                        {...register('image_url')}
                        type="url"
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/image.jpg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                      >
                        <Image className="h-4 w-4" />
                      </button>
                    </div>
                    {errors.image_url && (
                      <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
                    )}
                    {watch('image_url') && (
                      <div className="mt-2 relative rounded-lg overflow-hidden border border-neutral-200">
                        <img
                          src={watch('image_url') || ''}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6">
                  {/* Meta Title */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Meta Title
                    </label>
                    <input
                      {...register('meta_title')}
                      type="text"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="SEO title (recommended: 50-60 characters)"
                    />
                    {errors.meta_title && (
                      <p className="mt-1 text-sm text-red-600">{errors.meta_title.message}</p>
                    )}
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      {...register('meta_description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="SEO description (recommended: 150-160 characters)"
                    />
                    {errors.meta_description && (
                      <p className="mt-1 text-sm text-red-600">{errors.meta_description.message}</p>
                    )}
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      SEO Keywords
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Add keyword and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addKeyword}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedKeywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-2 text-neutral-500 hover:text-neutral-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Categories
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Add category and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addCategory}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedCategories.map((category, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Add tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-100 text-accent-800"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-accent-600 hover:text-accent-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-200 p-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <div className="flex space-x-3">
                  {/* Schedule Publishing */}
                  {schedulePublish && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      <input
                        {...register('scheduled_publish_at')}
                        type="datetime-local"
                        className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setSchedulePublish(!schedulePublish)
                      if (schedulePublish) {
                        setValue('scheduled_publish_at', '')
                      }
                    }}
                    className="px-4 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4" />
                    <span>{schedulePublish ? 'Remove Schedule' : 'Schedule'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPublishAction('draft')
                      handleSubmit(getValues(), 'draft')
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2 text-neutral-700 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (schedulePublish && !getValues('scheduled_publish_at')) {
                        toast.error('Please select a publish date and time')
                        return
                      }
                      setPublishAction(schedulePublish ? 'schedule' : 'publish')
                      handleSubmit(getValues(), schedulePublish ? 'schedule' : 'publish')
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {schedulePublish ? (
                      <>
                        <Clock className="h-4 w-4" />
                        <span>Schedule Publish</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Publish Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Image Uploader */}
      {showImageUploader && (
        <ImageUploader
          currentUrl={watch('image_url') || ''}
          onImageSelect={(url) => setValue('image_url', url)}
          onClose={() => setShowImageUploader(false)}
        />
      )}
    </div>
  )
}