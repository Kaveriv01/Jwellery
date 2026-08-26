import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, UserMinus, UserCheck, ShieldAlert } from 'lucide-react';
import { userService } from '../../services/otherServices';
import { formatDate } from '../../lib/utils';
import { toast } from 'sonner';

export default function AdminCustomers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', search, page],
    queryFn: () => userService.getAllUsers({ search, page, limit }).then((r) => r.data),
    keepPreviousData: true,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id) => userService.toggleUserStatus(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['admin-customers']);
      toast.success(res.data.message);
    },
    onError: () => toast.error('Failed to change user status.'),
  });

  const customers = data?.users || [];
  const pagination = data?.pagination || {};

  return (
    <>
      <Helmet><title>Customers Directory — Admin | Jwellery</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view user accounts registered on Jwellery</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-gold pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Customers Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl animate-pulse" />)}
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
            <p className="text-gray-500 font-medium">No customers found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase border-b border-gray-100">
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Phone</th>
                    <th className="py-4 px-6">Joined Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-850">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-650">{c.phone || '-'}</td>
                      <td className="py-4 px-6 text-gray-500">{formatDate(c.createdAt)}</td>
                      <td className="py-4 px-6">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          c.isActive
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {c.isActive ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => toggleStatusMutation.mutate(c._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            c.isActive
                              ? 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                              : 'text-gray-300 hover:text-green-500 hover:bg-green-50'
                          }`}
                          title={c.isActive ? 'Deactivate Customer' : 'Activate Customer'}
                        >
                          {c.isActive ? <UserMinus size={16} /> : <UserCheck size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#C5A059] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:border-[#C5A059] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
