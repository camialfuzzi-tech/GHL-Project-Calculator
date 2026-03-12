export interface QuoteItem {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

export interface Quote {
  items: QuoteItem[];
  total: number;
}
