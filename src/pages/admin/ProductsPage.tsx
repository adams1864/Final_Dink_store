import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, updateProduct, deleteProduct, type Product, type ProductListMeta } from '../../services/api';
import { Trash2, Edit2, Save, X, Plus } from 'lucide-react';
import CreateProductModal from '../../components/CreateProductModal';
import { getCategoryLabel } from '../../config/productCategories';

const statusColors: Record<string, string> = {
  published: 'bg-green-100 text-green-800',
  unpublished: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
};

interface EditingProduct {
  id: number;
  price: string;
  stock: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<ProductListMeta | null>(null);
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'stock' | 'name' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    void loadProducts();
  }, [page, perPage, sortBy, sortOrder, statusFilter, searchTerm]);

  async function loadProducts() {
    try {
      setLoading(true);
      const result = await fetchProducts(undefined, undefined, {
        page,
        perPage,
        q: searchTerm,
        status: statusFilter || undefined,
       // sortBy,
        sortOrder,
      });
      setProducts(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error('Failed to load products', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  function handleCreateSuccess() {
    setShowCreateModal(false);
    void loadProducts();
  }

  function startEdit(product: Product) {
    setEditingProduct({
      id: product.id,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
  }

  function cancelEdit() {
    setEditingProduct(null);
  }

  async function saveEdit() {
    if (!editingProduct) return;

    const price = parseFloat(editingProduct.price);
    const stock = parseInt(editingProduct.stock, 10);

    if (isNaN(price) || price < 0) {
      alert('Invalid price');
      return;
    }

    if (isNaN(stock) || stock < 0) {
      alert('Invalid stock');
      return;
    }

    try {
      setUpdating(true);
      await updateProduct(editingProduct.id, { price, stock });
      await loadProducts();
      setEditingProduct(null);
      alert('Product updated successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await deleteProduct(product.id);
      await loadProducts();
      alert('Product deleted successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to delete product');
    }
  }

  async function handleStatusChange(product: Product, newStatus: string) {
    if (!confirm(`Change product status to "${newStatus}"?`)) {
      return;
    }

    try {
      await updateProduct(product.id, { status: newStatus });
      await loadProducts();
      alert('Product status updated');
    } catch (error: any) {
      alert(error.message || 'Failed to update product status');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row gap-2 w-full md:max-w-xl"
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search products by name"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="unpublished">Unpublished</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (ETB)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isEditing = editingProduct?.id === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.coverImage}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                        {getCategoryLabel(product.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, price: e.target.value })
                            }
                            className="w-24 px-2 py-1 border rounded"
                            disabled={updating}
                          />
                        ) : (
                          `${product.price.toLocaleString()}`
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, stock: e.target.value })
                            }
                            className="w-20 px-2 py-1 border rounded"
                            disabled={updating}
                          />
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={product.status}
                          onChange={(e) => handleStatusChange(product, e.target.value)}
                          className={`px-2 py-1 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${
                            statusColors[product.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="unpublished">Unpublished</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={saveEdit}
                                disabled={updating}
                                className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                title="Save"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                disabled={updating}
                                className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEdit(product)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit Price/Stock"
                              >
                                <Edit2 size={16} />
                              </button>
                              <Link
                                to={`/product/${product.id}`}
                                target="_blank"
                                className="text-gray-600 hover:text-gray-800"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleDelete(product)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {!loading && meta && (
        <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
          <div>
            Page {meta.page} of {meta.totalPages} · Total {meta.total} products
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={meta.page <= 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <CreateProductModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
