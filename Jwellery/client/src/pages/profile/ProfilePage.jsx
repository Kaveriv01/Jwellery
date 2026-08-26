import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/otherServices';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { User, Bell, Shield, Package, Heart, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/utils';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: user?.name || '', phone: user?.phone || '' });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => v && formData.append(k, v));
      return userService.updateProfile(formData);
    },
    onSuccess: (res) => {
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated!');
    },
    onError: () => toast.error('Failed to update profile.'),
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <>
      <Helmet><title>My Profile — Jwellery</title></Helmet>
      <div className="container-luxury py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#C5A059] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              {user?.createdAt && <p className="text-xs text-gray-300 mt-1">Member since {formatDate(user.createdAt)}</p>}
            </div>
            <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full px-5 py-3.5 text-sm transition-colors ${activeTab === tab.id ? 'bg-[#fdf9ee] text-[#C5A059] font-medium border-r-2 border-[#C5A059]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    <Icon size={15} /> {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-gray-900 text-lg">Personal Information</h2>
                  <button onClick={() => setEditing(!editing)} className="text-sm text-[#C5A059] hover:underline">
                    {editing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                {editing ? (
                  <div className="space-y-4 max-w-md">
                    <div><label className="text-xs text-gray-600 block mb-1">Full Name</label><input value={profileData.name} onChange={(e) => setProfileData((p) => ({ ...p, name: e.target.value }))} className="input-gold" /></div>
                    <div><label className="text-xs text-gray-600 block mb-1">Phone</label><input value={profileData.phone} onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))} className="input-gold" /></div>
                    <button onClick={() => updateProfileMutation.mutate(profileData)} disabled={updateProfileMutation.isPending} className="btn-gold rounded-xl py-2.5 px-6">
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm">
                    {[{ label: 'Name', value: user?.name }, { label: 'Email', value: user?.email }, { label: 'Phone', value: user?.phone || 'Not provided' }, { label: 'Role', value: user?.role }].map(({ label, value }) => (
                      <div key={label} className="flex gap-4">
                        <span className="w-24 text-gray-400">{label}</span>
                        <span className="font-medium text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="text-center py-10">
                <Link to="/profile/orders" className="btn-gold rounded-xl py-3 px-6">View My Orders</Link>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="text-center py-10">
                <Link to="/checkout" className="text-sm text-[#C5A059] hover:underline">Manage addresses during checkout</Link>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="text-center py-10">
                <Link to="/wishlist" className="btn-gold rounded-xl py-3 px-6">View My Wishlist</Link>
              </div>
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationsTab() {
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => import('../../services/otherServices').then((m) => m.userService.getNotifications()).then((r) => r.data),
  });
  const { mutate: markRead } = useMutation({
    mutationFn: () => import('../../services/otherServices').then((m) => m.userService.markNotificationsRead()),
    onSuccess: () => import('@tanstack/react-query').then((m) => m.useQueryClient().invalidateQueries(['notifications'])),
  });

  const notifications = data?.notifications || [];
  if (!notifications.length) return <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400"><Bell size={40} className="mx-auto mb-3 text-gray-200" />No notifications yet</div>;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Notifications</h2>
        {data?.unreadCount > 0 && <button onClick={() => markRead()} className="text-xs text-[#C5A059] hover:underline">Mark all as read</button>}
      </div>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div key={n._id} className={`p-3 rounded-xl border text-sm ${n.isRead ? 'border-gray-100 bg-gray-50' : 'border-[#C5A059]/20 bg-[#fdf9ee]'}`}>
            <p className="font-medium text-gray-800">{n.title}</p>
            <p className="text-gray-600 text-xs mt-0.5">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
