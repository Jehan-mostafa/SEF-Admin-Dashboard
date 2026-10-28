import React, { useState } from 'react';

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    brand: '',
    sku: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('الحد الأقصى المسموح به هو 5 صور[span_0](start_span)[span_0](end_span)');
      return;
    }
    setError('');
    
    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (images.length === 0) {
      setError('يجب إرفاق صورة واحدة على الأقل[span_1](start_span)[span_1](end_span)');
      setLoading(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    images.forEach(image => {
      data.append('images', image);
    });

    try {
      const response = await fetch('https://commerce-api-3wara.vercel.app/products', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('تمت إضافة المنتج بنجاح[span_2](start_span)[span_2](end_span)!');
        setFormData({
          name: '',
          shortDescription: '',
          description: '',
          price: '',
          discountPrice: '',
          stock: '',
          category: '',
          brand: '',
          sku: ''
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        setError(result.message || 'حدث خطأ أثناء إضافة المنتج.');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 font-sans" dir="rtl">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">إضافة منتج جديد (Admin)</h2>

      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-sm">{error}</div>}
      {successMessage && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm">{successMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* اسم المنتج */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">اسم المنتج *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
            placeholder="مثال: Wireless Headphones"
          />
        </div>

        {/* وصف قصير */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">وصف قصير *</label>
          <input
            type="text"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
            placeholder="High quality wireless headphones"
          />
        </div>

        {/* الأسعار والكمية */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">السعر ($) *</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
              placeholder="299.9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">سعر الخصم ($)</label>
            <input
              type="number"
              step="0.01"
              name="discountPrice"
              value={formData.discountPrice}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
              placeholder="249.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">الكمية (Stock) *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
              placeholder="50"
            />
          </div>
        </div>

        {/* القسم والفئة */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">القسم *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
              placeholder="Electronics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">رمز التخزين (SKU)</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
              placeholder="WH-001"
            />
          </div>
        </div>

        {/* الوصف التفصيلي */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">الوصف التفصيلي *</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 dark:bg-slate-800 dark:text-white text-sm outline-none transition"
            placeholder="Full product description..."
          />
        </div>

        {/* رفع الصور */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">صور المنتج (حد أقصى 5 صور) *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 dark:file:bg-slate-800 dark:file:text-teal-300 cursor-pointer"
          />
          
          <div className="flex gap-2.5 mt-3 flex-wrap">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                <img src={src} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-rose-700 shadow"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* زر الإرسال متناسق مع لون لوحة التحكم */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium py-3 px-4 rounded-lg transition text-sm shadow-sm disabled:opacity-50"
        >
          {loading ? 'جاري الإرسال...' : 'إنشاء المنتج (Create Product)'}
        </button>
      </form>
    </div>
  );
}
