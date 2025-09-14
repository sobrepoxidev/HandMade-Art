// src/lib/search.ts
import { supabase } from './supabaseClient';
// Database type is used indirectly through MediaItem interface

// Define MediaItem interface to match the one in types-db.ts
interface MediaItem {
  url: string;
  type: "image" | "video";
  caption?: string;
}

// Extend the Database products type with optional highlight field
export type SearchResult = {
  id: number;
  created_at?: string; // Make created_at optional to avoid type errors
  name: string | null;
  name_es: string | null;
  name_en: string | null;
  description: string | null;
  category_id: number | null;
  category_name?: string | null; // Added for convenience
  media: MediaItem[] | null;
  colon_price: number | null;
  dolar_price: number | null;
  discount_percentage?: number | null;
  highlight?: string; // For search results highlighting
  
};

/**
 * Search products by query string with optional category filter and pagination
 * @param query Search query string
 * @param locale The current locale ('es' or 'en')
 * @param category Optional category filter
 * @param pageOrLimit Number that can be either page number (when isPaginated=true) or limit (when isPaginated=false)
 * @param limit Number of results per page (only used when isPaginated=true)
 * @param sortBy Optional sorting method ('relevance', 'price-asc', 'price-desc', 'newest')
 * @param isPaginated If true, pageOrLimit is treated as page number, otherwise as limit
 * @returns Promise with search results and total count
 */
export async function searchProducts(
  query: string,
  locale: string,
  category?: string,
  pageOrLimit: number = 1,
  limit: number = 12,
  sortBy: string = 'relevance',
  isPaginated: boolean = true,
): Promise<{ results: SearchResult[], totalCount: number }> {
  try {
    // Basic input validation
    if (!query || query.trim().length < 2) {
      return { results: [], totalCount: 0 };
    }
    
    // Sanitize input to prevent SQL injection
    const sanitizedQuery = query.trim().replace(/[^\w\s]/gi, '');
    
    // First, get category ID if a category name is provided
    let categoryId: number | null = null;
    if (category && category !== 'Todo') {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('name', category)
        .single();
        
      if (categoryData) {
        categoryId = categoryData.id;
      }
    }
    
    // Calculate pagination offsets based on whether we're using pagination or just a limit
    let from: number;
    let to: number;
    
    if (isPaginated) {
      // pageOrLimit is treated as page number
      from = (pageOrLimit - 1) * limit;
      to = from + limit - 1;
    } else {
      // pageOrLimit is treated as limit (for autocomplete)
      from = 0;
      to = pageOrLimit - 1;
    }
    
    // Build query for counting total results
    const countQuery = supabase
      .from('products')
      .select('id', { count: 'exact' });
      
    // Add text search condition to count query
    const countQueryWithSearch = countQuery.or(
      `${locale === 'es' ? 'name_es' : 'name_en'}.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`
    );
    
    // Add category filter to count query if we have a category ID
    if (categoryId !== null) {
      countQueryWithSearch.eq('category_id', categoryId);
    }
    
    // Build main query with pagination
    let queryBuilder = supabase
      .from('products')
      .select('id, name, name_es, name_en, description, colon_price, dolar_price, media, category_id, discount_percentage, created_at');
    
    // Add text search condition
    queryBuilder = queryBuilder.or(
      `${locale === 'es' ? 'name_es' : 'name_en'}.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`
    );
    
    // Add category filter if we found a matching category ID
    if (categoryId !== null) {
      queryBuilder = queryBuilder.eq('category_id', categoryId);
    }
    
    // Apply sorting based on sortBy parameter
    if (sortBy === 'price-asc') {
      queryBuilder = queryBuilder.order('dolar_price', { ascending: true });
    } else if (sortBy === 'price-desc') {
      queryBuilder = queryBuilder.order('dolar_price', { ascending: false });
    } else if (sortBy === 'newest') {
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }
    // For 'relevance', we don't apply any specific ordering as results are already ranked by match quality
    
    // Apply pagination after all filters and sorting
    queryBuilder = queryBuilder.range(from, to);
    
    const { data, error } = await queryBuilder;
    
    if (error) {
      console.error('Search error:', error);
      return { results: [], totalCount: 0 };
    }
    
    // Get total count of matching products
    const { count: totalCount, error: countError } = await countQueryWithSearch;
    
    if (countError) {
      console.error('Count error:', countError);
      // Continue with results but set count to length of results
      // This ensures we still show something even if count fails
    }
    
    // Process results to add highlights
    const results = await Promise.all((data || []).map(async (product) => {
      // Convert media from Json to MediaItem[] | null
      const media: MediaItem[] | null = Array.isArray(product.media) ? product.media as unknown as MediaItem[] : null;
      
      const productWithTypedMedia = { ...product, media };
      const highlight = getHighlight(productWithTypedMedia, sanitizedQuery);
      
      // Fetch category name if product has a category_id
      let categoryName: string | null = null;
      if (product.category_id) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('name,name_es,name_en')
          .eq('id', product.category_id)
          .single();
          
        if (categoryData) {
          categoryName = locale === 'es' ? categoryData.name_es : categoryData.name_en || categoryData.name;
        }
      }
      
      // Create a properly typed SearchResult object
      const searchResult: SearchResult = { 
        id: product.id,
        name: product.name,
        name_es: product.name_es,
        name_en: product.name_en,
        description: product.description,
        colon_price: product.colon_price,
        dolar_price: product.dolar_price,
        media: media,
        category_id: product.category_id,
        category_name: categoryName,
        discount_percentage: product.discount_percentage,
        highlight
      };
      
      // Only add created_at if it exists in the product
      if ('created_at' in product) {
        searchResult.created_at = product.created_at as string;
      }
      
      return searchResult;
    }));
    
    return { 
      results, 
      totalCount: totalCount || results.length 
    };
  } catch (error) {
    console.error('Search error:', error);
    return { results: [], totalCount: 0 };
  }
}

/**
 * Create a highlighted snippet from the product data
 */
function getHighlight(product: SearchResult, query: string): string {
  if (!product.description) return '';
  
  const description = product.description;
  const queryLower = query.toLowerCase();
  const descLower = description.toLowerCase();
  
  // Find position of query in description
  const position = descLower.indexOf(queryLower);
  
  if (position === -1) {
    // If not found in description, return first 100 chars
    return description.substring(0, 100) + '...';
  }
  
  // Create a window around the match
  const start = Math.max(0, position - 40);
  const end = Math.min(description.length, position + query.length + 40);
  
  let highlight = '';
  
  if (start > 0) {
    highlight += '...';
  }
  
  highlight += description.substring(start, end);
  
  if (end < description.length) {
    highlight += '...';
  }
  
  return highlight;
}

/**
 * Get all available product categories with localization support
 * @param locale The current locale ('es' or 'en')
 */
export async function getProductCategories(locale: string): Promise<{id: number, name: string, name_es: string | null, name_en: string | null}[]> {
  try {
    // Fetch categories from the categories table with all name fields
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, name_es, name_en')
      .order(locale === 'es' ? 'name_es' : 'name_en');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
