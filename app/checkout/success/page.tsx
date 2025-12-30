"use client";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  total: number;
  date: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("order");
    if (!orderId) {
      router.push('/');
      return;
    }
    try {
      const orderDataStr = sessionStorage.getItem("orderData");
      if (!orderDataStr) {
        setIsLoaded(true);
        return;
      }
      const orderData = JSON.parse(orderDataStr) as OrderData;
      if (orderData.orderId !== orderId) {
        router.push('/');
        return;
      }
      setOrderDetails(orderData);
      setIsLoaded(true);
      const timer = setTimeout(() => {
        sessionStorage.removeItem("orderData");
      }, 2000);
      return () => clearTimeout(timer);
    } catch (error) {
      setIsLoaded(true);
    }
  }, [searchParams, router]);

  if (!isLoaded) {
    return (
      <div className="container py-10 px-4 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Processing your order...</h1>
        </div>
      </div>
    );
  }
  if (!orderDetails) {
    return (
      <div className="container py-10 px-4 max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Order Not Found</h1>
          <p className="mt-4">We couldn't find your order details. Please contact customer service.</p>
          <div className="mt-8">
            <Button asChild className="mr-4">
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-10 px-4 max-w-4xl mx-auto">
      <div className="text-center space-y-6 mb-10">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Your order has been successfully placed and will be processed soon. </p>
        <p className="text-muted-foreground max-w-xl mx-auto">
          A confirmation email with all the details has been sent to your email address, 
          and you'll receive updates on your phone.
        </p>
      </div>
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div>
            <h2 className="font-bold text-xl mb-2">Order Confirmation</h2>
            <p className="text-muted-foreground">Order #{orderDetails.orderId}</p>
            <p className="text-muted-foreground">Date: {orderDetails.date}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="font-medium">{orderDetails.customerName}</p>
            <p className="text-muted-foreground">{orderDetails.email}</p>
            {orderDetails.phone && (
              <p className="text-muted-foreground">{orderDetails.phone}</p>
            )}
          </div>
        </div>
        <h3 className="font-semibold mb-2">Order Summary</h3>
        <div className="space-y-4">
          {orderDetails.items.length > 0 ? (
            <>
              {orderDetails.items.map((item: OrderItem, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-muted-foreground">Your ordered items will appear here.</p>
          )}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{orderDetails.total.toLocaleString()}</span>
          </div>
        </div>
      </Card>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild className="flex items-center gap-2">
          <Link href="/products">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex items-center gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-10 px-4 max-w-4xl mx-auto"><h1 className="text-3xl font-bold">Loading...</h1></div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
