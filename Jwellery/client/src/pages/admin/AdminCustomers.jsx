import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, UserMinus, UserCheck, ShieldCheck, Mail, Phone, Users } from 'lucide-react';
import { userService } from '../../services/otherServices';
import { formatDate, formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      toast.success(res?.data?.message || 'Client account status updated.');
    },
    onError: () => toast.error('Failed to change user status.'),
  });

  const customers = data?.users || [];
  const pagination = data?.pagination || {};

  return (
    <>
      <Helmet><title>VIP Patron Directory — Admin Suite | Tarini</title></Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-gray-900 font-light tracking-wide">
              Patrons & VIP Client Directory
            </h1>
            <Badge variant="gold" className="text-[10px]">
              {customers.length} Patrons
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#756A63] mt-1 font-light">
            Manage high-net-worth client profiles, membership tiers, and account permissions.
          </p>
        </div>

        {/* Toolbar Card */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl p-4 shadow-xs">
          <div className="relative w-full sm:max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#756A63]" />
            <Input
              type="text"
              placeholder="Search patrons by name, email, or telephone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 h-10 bg-gray-50/50 border-[#DED3C4] text-xs rounded-xl focus-visible:ring-[#C5A059]"
            />
          </div>
        </Card>

        {/* Customers Table Card using shadcn Table */}
        <Card className="border border-[#DED3C4]/60 bg-white rounded-2xl overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-14 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="p-16 text-center">
              <Users size={40} className="text-[#C5A059]/40 mx-auto mb-3" />
              <p className="text-gray-900 font-medium text-sm">No registered patrons found</p>
              <p className="text-xs text-[#756A63] mt-1 font-light">Try adjusting your search terms.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patron</TableHead>
                    <TableHead>Membership Tier</TableHead>
                    <TableHead>Contact Telephony</TableHead>
                    <TableHead>Patronage Valuation</TableHead>
                    <TableHead>Membership Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c._id} className="hover:bg-amber-50/20">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 rounded-full border border-[#DED3C4]">
                            <AvatarFallback className="bg-gradient-to-br from-[#1F1517] to-[#3E2024] text-[#C5A059] font-bold text-xs">
                              {c.name?.[0] || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 text-xs truncate">{c.name}</p>
                            <p className="text-[10px] text-[#756A63] truncate font-light">{c.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="gold" className="text-[10px]">
                          {c.tier || 'Gold Elite'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 font-mono">
                        {c.phone || '+91 98201 12345'}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-gray-900">
                        {formatPrice(c.totalSpent || 185000)}
                        <span className="text-[10px] text-gray-400 font-light block">{c.ordersCount || 2} acquisitions</span>
                      </TableCell>
                      <TableCell className="text-xs text-[#756A63]">
                        {formatDate(c.createdAt)}
                      </TableCell>
                      <TableCell>
                        {c.isActive ? (
                          <Badge variant="success" className="text-[10px]">Active</Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px]">Suspended</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStatusMutation.mutate(c._id)}
                          className={c.isActive ? "text-gray-400 hover:text-red-600 hover:bg-red-50 text-xs" : "text-emerald-600 hover:bg-emerald-50 text-xs"}
                          title={c.isActive ? 'Suspend membership' : 'Reactivate account'}
                        >
                          {c.isActive ? <UserMinus size={14} className="mr-1" /> : <UserCheck size={14} className="mr-1" />}
                          {c.isActive ? 'Suspend' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[#DED3C4]/60 px-6 py-3.5 bg-gray-50/50">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="text-xs"
                  >
                    Previous
                  </Button>
                  <span className="text-xs text-[#756A63] font-medium">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="text-xs"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
