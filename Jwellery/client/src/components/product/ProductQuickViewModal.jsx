import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { openCartDrawer } from '@/components/cart/CartDrawer';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  ShoppingBag, 
  Check, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductQuickViewModal({ product, isOpen, onOpenChange }) {
  if (!product) return null;

  const { addToCart, isAddingToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const {
    _id,
    name,
    slug,
    images = [],
    price,
    discountPrice,
    description,
    metal,
    purity,
    grossWeight,
    diamondWeight,
    diamondQuality,
    category,
    sku,
    isBestSeller,
    isNewArrival
  } = product;

  const displayImages = images.length > 0 
    ? images.map(img => img.url) 
    : ['/images/cat-ring.png'];

  const effectivePrice = discountPrice || price;
  const discountPercent = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  const handleAddToCart = () => {
    addToCart({ productId: _id, quantity });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onOpenChange(false);
      openCartDrawer();
    }, 600);
  };

  const currentImg = displayImages[selectedImageIdx] || displayImages[0];
  const whatsappMsg = encodeURIComponent(`Hello Tarini Concierge, I am inquiring about the ${name} (SKU: ${sku || _id}). Could you provide more details?`);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl p-0 overflow-hidden bg-[#160B0E] border-[#C5A059]/30 text-[#FAF8F5] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Imagery Gallery */}
          <div className="p-6 bg-[#12080B] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#C5A059]/20">
            <div className="relative aspect-square w-full bg-[#1A1215] rounded-lg overflow-hidden border border-[#C5A059]/20 flex items-center justify-center">
              <img 
                src={currentImg} 
                alt={name} 
                className="w-full h-full object-contain p-4 transition-all duration-300"
              />
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" className="text-[10px] uppercase font-bold tracking-widest shadow-md">
                    {discountPercent}% OFF
                  </Badge>
                </div>
              )}
              {(isBestSeller || isNewArrival) && (
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-[#2A181C] text-[#C5A059] border border-[#C5A059]/30 text-[10px] tracking-wider uppercase font-semibold">
                    {isBestSeller ? 'Bestseller' : 'New In'}
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-thin">
                {displayImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-14 h-14 rounded-md overflow-hidden border transition-all shrink-0 ${
                      selectedImageIdx === idx 
                        ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40' 
                        : 'border-[#C5A059]/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-[#C5A059]/15 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] mb-1" />
                <span className="text-[9px] text-[#DED3C4] uppercase tracking-wider font-semibold">BIS Hallmarked</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-[#C5A059] mb-1" />
                <span className="text-[9px] text-[#DED3C4] uppercase tracking-wider font-semibold">Insured Transit</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-[#C5A059] mb-1" />
                <span className="text-[9px] text-[#DED3C4] uppercase tracking-wider font-semibold">Lifetime Exchange</span>
              </div>
            </div>
          </div>

          {/* Right: Product Dossier & Buying Controls */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A059] mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                {category?.name || 'High Jewellery'}
              </div>

              <DialogHeader className="p-0 text-left space-y-1">
                <DialogTitle className="font-serif text-2xl font-normal tracking-wide text-[#FAF8F5] leading-snug">
                  {name}
                </DialogTitle>
                {sku && (
                  <DialogDescription className="text-[11px] text-[#9E8E89]">
                    SKU: {sku}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Price Row */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold font-montserrat text-[#C5A059]">
                  {formatPrice(effectivePrice)}
                </span>
                {discountPrice && (
                  <span className="text-sm line-through text-[#9E8E89] font-montserrat">
                    {formatPrice(price)}
                  </span>
                )}
                <span className="text-[10px] text-[#9E8E89] uppercase tracking-wider ml-auto">
                  Taxes Included
                </span>
              </div>

              <Separator className="my-4 bg-[#C5A059]/20" />

              {/* Specifications Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-[#1A1215] p-2.5 rounded border border-[#C5A059]/15">
                  <span className="text-[10px] text-[#9E8E89] uppercase tracking-wider block">Precious Metal</span>
                  <span className="font-medium text-[#FAF8F5]">{purity || '18K'} {metal || 'Yellow Gold'}</span>
                </div>
                <div className="bg-[#1A1215] p-2.5 rounded border border-[#C5A059]/15">
                  <span className="text-[10px] text-[#9E8E89] uppercase tracking-wider block">Gross Weight</span>
                  <span className="font-medium text-[#FAF8F5]">{grossWeight ? `${grossWeight} g` : 'Est. 4.8 g'}</span>
                </div>
                {diamondWeight && (
                  <div className="bg-[#1A1215] p-2.5 rounded border border-[#C5A059]/15">
                    <span className="text-[10px] text-[#9E8E89] uppercase tracking-wider block">Diamonds</span>
                    <span className="font-medium text-[#FAF8F5]">{diamondWeight} ct ({diamondQuality || 'VVS-VS / EF'})</span>
                  </div>
                )}
                <div className="bg-[#1A1215] p-2.5 rounded border border-[#C5A059]/15">
                  <span className="text-[10px] text-[#9E8E89] uppercase tracking-wider block">Certification</span>
                  <span className="font-medium text-[#FAF8F5]">IGI / SGL Certified</span>
                </div>
              </div>

              {description && (
                <p className="text-xs text-[#DED3C4] line-clamp-2 leading-relaxed mb-4">
                  {description}
                </p>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs uppercase tracking-wider text-[#9E8E89] font-medium">Quantity:</span>
                <div className="flex items-center border border-[#C5A059]/30 rounded-md overflow-hidden bg-[#1A1215]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-xs text-[#FAF8F5] hover:bg-[#C5A059]/20 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#C5A059]">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-xs text-[#FAF8F5] hover:bg-[#C5A059]/20 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-[#C5A059]/20">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-[#C5A059] hover:bg-[#d8b56f] text-[#160B0E] font-bold text-xs uppercase tracking-[0.2em] py-5 rounded-md shadow-lg transition-all"
              >
                {addedSuccess ? (
                  <span className="flex items-center gap-2">
                    <Check className="w-4 h-4" /> Added to Your Bag
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Add To Shopping Bag
                  </span>
                )}
              </Button>

              <div className="flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-[#C5A059]/40 text-[#FAF8F5] hover:bg-[#C5A059]/10 text-xs uppercase tracking-wider py-4"
                >
                  <Link to={`/products/${slug}`} onClick={() => onOpenChange(false)}>
                    View Full Dossier <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-emerald-600/50 text-emerald-400 hover:bg-emerald-950/40 text-xs px-3"
                  title="Inquire via WhatsApp"
                >
                  <a 
                    href={`https://wa.me/919999999999?text=${whatsappMsg}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
