export interface SearchResult {
  id: string;
  type: "channel" | "movie" | "series" | "episode";
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  rating?: number;
  relevanceScore: number;
}

export interface SearchFilters {
  type?: "channel" | "movie" | "series" | "episode";
  category?: string;
  sortBy?: "relevance" | "name" | "rating" | "recent";
  limit?: number;
  offset?: number;
}

export class SearchService {
  private searchHistory: string[] = [];
  private searchIndex: Map<string, string[]> = new Map(); // word -> items

  /**
   * Search across all content
   */
  search(query: string, filters?: SearchFilters): SearchResult[] {
    const normalizedQuery = this.normalizeQuery(query);

    if (normalizedQuery.length < 2) {
      return [];
    }

    // Add to search history
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query);
      if (this.searchHistory.length > 50) {
        this.searchHistory.pop();
      }
    }

    const results = this.performSearch(normalizedQuery, filters);
    return this.rankResults(results);
  }

  /**
   * Perform actual search
   */
  private performSearch(
    query: string,
    filters?: SearchFilters,
  ): SearchResult[] {
    const results: SearchResult[] = [];

    // In real implementation, search database/API
    // For now, returning mock results
    const mockResults: SearchResult[] = [
      {
        id: "ch-1",
        type: "channel",
        title: `${query} TV`,
        description: `Watch ${query} live`,
        category: "Entertainment",
        relevanceScore: 1.0,
      },
      {
        id: "mov-1",
        type: "movie",
        title: `${query} Movie`,
        description: `Popular ${query} movie`,
        rating: 8.5,
        relevanceScore: 0.85,
      },
    ];

    for (const result of mockResults) {
      if (filters?.type && result.type !== filters.type) {
        continue;
      }
      if (filters?.category && result.category !== filters.category) {
        continue;
      }
      results.push(result);
    }

    return results;
  }

  /**
   * Get search suggestions
   */
  getSuggestions(query: string, limit: number = 10): string[] {
    const normalized = this.normalizeQuery(query);
    if (normalized.length < 2) {
      return [];
    }

    // Return recent searches and related suggestions
    const suggestions = this.searchHistory
      .filter((item) => item.toLowerCase().includes(normalized))
      .slice(0, limit);

    // Add common suggestions
    const commonSuggestions = [
      `${query} live`,
      `${query} movies`,
      `${query} series`,
      `${query} channel`,
    ];

    for (const suggestion of commonSuggestions) {
      if (suggestions.length < limit && !suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }

    return suggestions;
  }

  /**
   * Get search history
   */
  getSearchHistory(limit: number = 20): string[] {
    return this.searchHistory.slice(0, limit);
  }

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    this.searchHistory = [];
  }

  /**
   * Remove item from search history
   */
  removeFromHistory(query: string): void {
    const index = this.searchHistory.indexOf(query);
    if (index > -1) {
      this.searchHistory.splice(index, 1);
    }
  }

  /**
   * Index content for search
   */
  indexContent(contentId: string, words: string[]): void {
    for (const word of words) {
      const normalized = word.toLowerCase();
      if (!this.searchIndex.has(normalized)) {
        this.searchIndex.set(normalized, []);
      }
      const items = this.searchIndex.get(normalized);
      if (items && !items.includes(contentId)) {
        items.push(contentId);
      }
    }
  }

  /**
   * Advanced search with multiple criteria
   */
  advancedSearch(criteria: {
    keywords?: string[];
    category?: string;
    rating?: { min: number; max: number };
    type?: string[];
  }): SearchResult[] {
    // Complex search implementation
    const results: SearchResult[] = [];

    // Search implementation would go here
    if (criteria.keywords) {
      for (const keyword of criteria.keywords) {
        const keywordResults = this.search(keyword, {
          type: criteria.type?.[0] as any,
        });
        results.push(...keywordResults);
      }
    }

    // Remove duplicates
    const uniqueResults = Array.from(
      new Map(results.map((r) => [r.id, r])).values(),
    );

    return uniqueResults;
  }

  /**
   * Normalize search query
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "");
  }

  /**
   * Rank search results
   */
  private rankResults(results: SearchResult[]): SearchResult[] {
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Spellcheck suggestion
   */
  getSpellCheckSuggestion(query: string): string | null {
    const normalized = this.normalizeQuery(query);

    // Simple spell check logic
    for (const historyItem of this.searchHistory) {
      const historyNorm = this.normalizeQuery(historyItem);
      if (this.calculateSimilarity(normalized, historyNorm) > 0.8) {
        return historyItem;
      }
    }

    return null;
  }

  /**
   * Calculate string similarity (simple implementation)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }
}

export default new SearchService();
