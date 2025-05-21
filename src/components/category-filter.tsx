// components/category-filter.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchCategories } from "@/lib/categories";
import { Loader2 } from "lucide-react";

interface CategoryFilterProps {
  onCategoryChange: (selectedCategories: string[]) => void;
  initialSelected?: string[];
}

export default function CategoryFilter({ onCategoryChange, initialSelected = [] }: CategoryFilterProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialSelected);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await fetchCategories();
        const categoryNames = categoriesData.map((cat) => cat.category_name).sort();
        setCategories(categoryNames);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Sync selectedCategories with initialSelected when it changes
  useEffect(() => {
    setSelectedCategories(initialSelected);
  }, [initialSelected]);

  // Handle checkbox changes
  const handleCategoryChange = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelected);
    onCategoryChange(newSelected);
  };

  // Reset category selection
  const resetSelection = () => {
    setSelectedCategories([]);
    onCategoryChange([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Category</h3>
        {selectedCategories.length > 0 && (
          <button className="text-purple-600 text-sm hover:underline" onClick={resetSelection}>
            Reset
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
        {categories.length > 0 ? (
          categories.map((category) => {
            const id = category.toLowerCase().replace(/\s+/g, "-");
            return (
              <div key={id} className="flex items-center">
                <input
                  type="checkbox"
                  id={id}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor={id} className="ml-2 text-sm">
                  {category}
                </label>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">No categories available</p>
        )}
      </div>
    </div>
  );
}