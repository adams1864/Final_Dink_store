import { Link } from 'react-router-dom';
import { Product as ApiProduct, formatPrice } from '../services/api';

interface ProductCardProps {
  product: ApiProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const isOutOfStock = product.stock === 0;
  const productImage = product.images && product.images.length > 0 ? product.images[0] : product.coverImage;

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-[#D92128] text-white text-xs font-bold px-3 py-1 rounded-full">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#1A1A1A] text-white text-xs font-bold px-3 py-1 rounded-full">
                BEST SELLER
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <h3
            className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#D92128] transition-colors"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-[#1A1A1A]">
              {formatPrice(product.price)}
            </span>
            {product.sku && (
              <span className="text-xs text-gray-500 uppercase">{product.sku}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${isOutOfStock ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
            </span>
            <span className="text-sm font-medium text-[#D92128]">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
