import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import ProductsPage from './ProductsPage';

export default function CategoryPage() {
  const { slug } = useParams();
  // Re-use products page with category filter set
  return <ProductsPage />;
}
