import { createContext, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/utils';
import { openCartDrawer } from '../components/cart/CartDrawer';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  /** Fetch cart only when authenticated */
  const { data: cartData, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getCart().then((res) => res.data),
    staleTime: 30_000,
  });

  const cart = cartData?.cart || { items: [] };
  const summary = cartData?.summary || {};

  const invalidateCart = () => queryClient.invalidateQueries({ queryKey: ['cart'] });

  const addToCart = useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: (_, variables) => {
      invalidateCart();
      toast.success('Added to cart!');
      openCartDrawer();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }) => cartService.updateItem(itemId, { quantity }),
    onSuccess: () => invalidateCart(),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeItem = useMutation({
    mutationFn: cartService.removeItem,
    onSuccess: () => {
      invalidateCart();
      toast.success('Item removed from cart.');
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const applyCoupon = useMutation({
    mutationFn: cartService.applyCoupon,
    onSuccess: (res) => {
      invalidateCart();
      toast.success(res.data.message);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const removeCoupon = useMutation({
    mutationFn: cartService.removeCoupon,
    onSuccess: () => {
      invalidateCart();
      toast.info('Coupon removed.');
    },
  });

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        summary,
        totalItems,
        isLoading,
        addToCart: addToCart.mutate,
        updateItem: updateItem.mutate,
        removeItem: removeItem.mutate,
        applyCoupon: applyCoupon.mutateAsync,
        removeCoupon: removeCoupon.mutate,
        isAddingToCart: addToCart.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
