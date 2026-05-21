import { getCategories } from "@/actions/categories";
import CategoryManager from "@/components/dashboard/CategoryManager";

export const metadata = { title: "Categories — Floussi.Pro" };

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">Categories</h1>
        <p className="text-sm text-muted mt-1">Manage your spending categories and colour-code them.</p>
      </div>
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
