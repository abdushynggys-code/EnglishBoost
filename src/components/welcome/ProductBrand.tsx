import { Link } from 'wouter';
import { Icon } from '../Icon';

export function ProductBrand() {
  return <Link href="/" className="product-brand" aria-label="EnglishBoost">
    <span><Icon name="book" size={23} /></span>EnglishBoost<span className="product-brand-dot">.</span>
  </Link>;
}
