import { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';
import { openCartDrawer } from '../components/cart/CartDrawer';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: wishlistData } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.getWishlist().then((res) => res.data),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  const wishlist = wishlistData?.wishlist || { items: [] };
  const wishlistCount = wishlistData?.count || 0;

  const invalidateWishlist = () => queryClient.invalidateQueries({ queryKey: ['wishlist'] });

  const toggleWishlist = useMutation({
    mutationFn: wishlistService.toggle,
    onMutate: async ({ productId }) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      const previousWishlist = queryClient.getQueryData(['wishlist']);
      
      queryClient.setQueryData(['wishlist'], (old) => {
        if (!old) return old;
        const items = old.wishlist?.items || [];
        const exists = items.some((item) => item.product?._id === productId || item.product === productId);
        let newItems;
        if (exists) {
           newItems = items.filter((item) => item.product?._id !== productId && item.product !== productId);
        } else {
           newItems = [{ product: { _id: productId } }, ...items];
        }
        return {
          ...old,
          wishlist: { ...old.wishlist, items: newItems },
          count: newItems.length,
        };
      });

      return { previousWishlist };
    },
    onError: (error, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(['wishlist'], context.previousWishlist);
      }
      toast.error(getErrorMessage(error));
    },
    onSettled: () => {
      invalidateWishlist();
    },
    onSuccess: (res) => {
      const { isWishlisted } = res.data;
      if (isWishlisted) toast.success('Added to wishlist ❤️');
      else toast.info('Removed from wishlist');
    },
  });

  const moveToCart = useMutation({
    mutationFn: wishlistService.moveToCart,
    onSuccess: () => {
      invalidateWishlist();
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Moved to cart!');
      openCartDrawer();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const isWishlisted = (productId) =>
    wishlist.items?.some((item) => item.product?._id === productId || item.product === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isWishlisted,
        toggleWishlist: toggleWishlist.mutate,
        moveToCart: moveToCart.mutate,
        isToggling: toggleWishlist.isPending,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
