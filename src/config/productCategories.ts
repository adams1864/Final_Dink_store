export const PRODUCT_CATEGORIES = [
  { value: 'laptops-computers', label: 'Laptops & Computers' },
  { value: 'phones-tablets', label: 'Phones & Tablets' },
  { value: 'gaming', label: 'Gaming & Consoles' },
  { value: 'audio', label: 'Audio & Headphones' },
  { value: 'cameras', label: 'Cameras & Photography' },
  { value: 'smart-watches', label: 'Smart Watches' },
  { value: 'monitors', label: 'Monitors & Displays' },
  { value: 'accessories', label: 'Accessories & Peripherals' },
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]['value'];

export const DEFAULT_PRODUCT_CATEGORY: ProductCategory = 'accessories';

export function getCategoryLabel(value: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/** Infer electronics category from product name/description (used for seeding & display). */
export function inferProductCategory(name: string, description = ''): ProductCategory {
  const text = `${name} ${description}`.toLowerCase();

  if (/laptop|pavilion|omen|mac mini|macbook|thinkpad|notebook|computer|desktop pc/i.test(text)) {
    return 'laptops-computers';
  }
  if (/playstation|ps5|ps4|xbox|gaming|console|nintendo/i.test(text)) {
    return 'gaming';
  }
  if (/airpods|headphone|earbud|speaker|audio|soundbar|studio monitor|bluetooth speaker/i.test(text)) {
    return 'audio';
  }
  if (/iphone|ipad|galaxy s|galaxy tab|\bphone\b|tablet|pixel|smartphone/i.test(text)) {
    return 'phones-tablets';
  }
  if (/canon|camera|eos|dslr|mirrorless|photography|sony alpha|nikon/i.test(text)) {
    return 'cameras';
  }
  if (/smart watch|smartwatch|apple watch|galaxy watch|fitbit/i.test(text)) {
    return 'smart-watches';
  }
  if (/monitor|display|\btv\b|television|screen/i.test(text)) {
    return 'monitors';
  }
  return 'accessories';
}

export const LEGACY_CATEGORY_MAP: Record<string, ProductCategory> = {
  'match-kits': 'accessories',
  training: 'accessories',
  casual: 'accessories',
  accessories: 'accessories',
};

export function normalizeProductCategory(value: string, name = '', description = ''): ProductCategory {
  const known = PRODUCT_CATEGORIES.find((c) => c.value === value);
  if (known) return known.value;
  if (value in LEGACY_CATEGORY_MAP) {
    return inferProductCategory(name, description);
  }
  return inferProductCategory(name, description);
}
