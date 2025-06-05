import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, ShoppingCart, Star } from 'lucide-react';

function CheckoutButton({ priceId, label, bestValue }: { priceId: string, label: string, bestValue?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/stripe/checkout', {
        price_id: priceId,
      });

        const data = await response.json();

      if (data.session_url) {
        window.location.href = data.session_url; // Redirect to Stripe Checkout
      } else {
        toast({
          title: "Checkout Error",
          description: "Failed to start checkout session",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-full px-5 py-2 flex items-center gap-2 shadow transition-colors duration-150 disabled:bg-yellow-200 disabled:cursor-not-allowed"
          onClick={handleClick}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <CreditCard className="h-5 w-5" />
          {label}
          {bestValue && <Star className="h-4 w-4 fill-current" />}
      </button>
    </div>
    
  );
}

export default CheckoutButton;
