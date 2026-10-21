import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 py-8 px-4">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your store: categories, products, and orders.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/products"
          className="block p-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span className="text-lg font-medium text-gray-900">Categories</span>
          <p className="text-sm text-gray-500 mt-1">Add and edit product types (categories) that products belong to.</p>
        </Link>
        <Link
          href="/admin/products-list"
          className="block p-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span className="text-lg font-medium text-gray-900">Products</span>
          <p className="text-sm text-gray-500 mt-1">View and manage products by category: add, edit, delete.</p>
        </Link>
        <Link
          href="/admin/orders"
          className="block p-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span className="text-lg font-medium text-gray-900">Orders</span>
          <p className="text-sm text-gray-500 mt-1">View orders and update payment or shipping status.</p>
        </Link>
        <Link
          href="/admin/box-rates"
          className="block p-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span className="text-lg font-medium text-gray-900">Box material rates</span>
          <p className="text-sm text-gray-500 mt-1">Update Kraft, White, and Dreamcoat rates for the box widget (unit price = L×W×H×rate).</p>
        </Link>
        <Link
          href="/admin/saved-designs"
          className="block p-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
        >
          <span className="text-lg font-medium text-gray-900">Saved designs</span>
          <p className="text-sm text-gray-500 mt-1">View and open box designs saved from the custom tool. Each link loads the design in the designer.</p>
        </Link>
      </div>
    </div>
  );
}
