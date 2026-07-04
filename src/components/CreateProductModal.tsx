import React, { useState } from 'react';
import { API_BASE_URL } from '../services/api';
import apiFetch from '../services/fetcher';
import { X, Upload, Loader2 } from 'lucide-react';
import {
  DEFAULT_PRODUCT_CATEGORY,
  PRODUCT_CATEGORIES,
} from '../config/productCategories';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: DEFAULT_PRODUCT_CATEGORY,
  gender: 'unisex',
  size: '',
  colorValues: '',
  sku: '',
  material: '',
  weight: '',
  fit: '1 Year',
  features: 'Fast delivery, Quality checked, MYT support',
  coverImage: '',
  image1: '',
  image2: '',
  status: 'published',
};

const CreateProductModal: React.FC<CreateProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({ ...INITIAL_FORM });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'image1' | 'image2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await apiFetch(`${API_BASE_URL}/upload?folder=myt_belew/products`, {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();

      setFormData((prev) => ({ ...prev, [field]: data.url }));

      if (field === 'coverImage') {
        setImagePreview(data.url);
      }

      setError(null);
    } catch (err) {
      console.error('Image upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const featuresArray = formData.features.split(',').map((f) => f.trim()).filter(Boolean);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        gender: formData.gender,
        size: formData.size,
        color: formData.colorValues,
        sku: formData.sku,
        material: formData.material,
        weight: formData.weight,
        fit: formData.fit,
        features: JSON.stringify(featuresArray),
        coverImage: formData.coverImage,
        image1: formData.image1,
        image2: formData.image2,
        status: formData.status,
      };

      const response = await apiFetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      onSuccess();
      onClose();
      setFormData({ ...INITIAL_FORM });
      setImagePreview('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create New Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="e.g., HP Pavilion Laptop, Sony WH-1000XM5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                rows={3}
                placeholder="Key specs, condition, what's included in the box..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (ETB) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="45999.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="15"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData((prev) => ({ ...prev, material: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Apple, HP, Sony, Canon..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model / Variant</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="e.g., PS5 Slim, R6 Mark II, 256GB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <input
                  type="text"
                  value={formData.colorValues}
                  onChange={(e) => setFormData((prev) => ({ ...prev, colorValues: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Black, Silver, Blue"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Warranty</label>
                <input
                  type="text"
                  value={formData.fit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fit: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="1 Year, 6 Months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sku: e.target.value }))}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="MYT-001"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Highlights</h3>
            <div>
              <label className="block text-sm font-medium mb-2">Features (comma-separated)</label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="Bluetooth, Fast charging, Original box, Free delivery"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Product Images</h3>
            <p className="text-sm text-gray-600">Upload images (recommended) or paste Cloudinary URLs</p>

            <div>
              <label className="block text-sm font-medium mb-2">Cover Image *</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, coverImage: e.target.value }))}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="https://res.cloudinary.com/... or upload below"
                  disabled={loading}
                />
                <label className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {loading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'coverImage')}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image 1 (Optional)</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={formData.image1}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image1: e.target.value }))}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="https://res.cloudinary.com/... or upload below"
                  disabled={loading}
                />
                <label className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {loading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image1')}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              {formData.image1 && formData.image1.startsWith('http') && (
                <img src={formData.image1} alt="Image 1" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image 2 (Optional)</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={formData.image2}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image2: e.target.value }))}
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="https://res.cloudinary.com/... or upload below"
                  disabled={loading}
                />
                <label className={`px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 ${loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {loading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image2')}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              {formData.image2 && formData.image2.startsWith('http') && (
                <img src={formData.image2} alt="Image 2" className="mt-2 w-32 h-32 object-cover rounded-lg border" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
