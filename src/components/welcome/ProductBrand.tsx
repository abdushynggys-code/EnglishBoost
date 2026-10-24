import { Link } from "wouter";
import { BrandMark } from "../BrandMark";

export function ProductBrand() {
  return (
    <Link href="/" className="product-brand" aria-label="EnglishBoost">
      <span>
        <BrandMark size={40} />
      </span>
      EnglishBoost<span className="product-brand-dot">.</span>
    </Link>
  );
}
