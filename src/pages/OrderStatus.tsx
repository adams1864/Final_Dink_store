import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReceiptUrl, verifyChapaPayment } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function OrderStatus() {
  const rawSearch = typeof window !== 'undefined' ? window.location.search.replace(/&amp;/g, '&') : '';
  const params = new URLSearchParams(rawSearch);
  const txRef = params.get('tx_ref') || params.get('amp;tx_ref') || '';
  const orderId = params.get('order_id') || params.get('amp;order_id') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'missing'>('loading');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { clear } = useCart();

  useEffect(() => {
    if (!txRef) {
      setStatus('missing');
      return;
    }

    let isMounted = true;
    verifyChapaPayment(txRef)
      .then((result) => {
        if (!isMounted) return;
        if (result.status === 'success' && result.customerReceiptToken) {
          setReceiptUrl(getReceiptUrl(result.customerReceiptToken, { download: true }));
          clear();
          setStatus('success');
        } else {
          setStatus('failed');
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setErrorMessage(err.message || 'Failed to verify payment.');
        setStatus('failed');
      });

    return () => {
      isMounted = false;
    };
  }, [txRef, clear]);

  return (
    <div className="min-h-screen pt-20 bg-[#F4F4F4]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
          {status === 'loading' && (
            <>
              <div className="text-blue-600 text-3xl mb-4">...</div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Checking payment status</h1>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-600 text-3xl mb-4">OK</div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Payment successful</h1>
              <p className="text-gray-600">Your order is confirmed. Download your receipt below.</p>
              <div className="mt-4 bg-[#F8F8F8] border border-gray-200 rounded-lg p-4 text-left">
                {orderId && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Order ID:</span> {orderId}
                  </p>
                )}
                {txRef && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Tx Ref:</span> {txRef}
                  </p>
                )}
                <p className="text-sm text-gray-600">Receipt type: Customer copy</p>
              </div>
              {receiptUrl && (
                <a
                  href={receiptUrl}
                  className="inline-flex items-center justify-center mt-6 bg-[#D92128] text-white px-6 py-2 rounded-lg hover:bg-[#b91a20] transition-colors"
                >
                  Download Receipt
                </a>
              )}
            </>
          )}

          {(status === 'failed' || status === 'missing') && (
            <>
              <div className="text-red-600 text-3xl mb-4">!</div>
              <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Payment not completed</h1>
              <p className="text-gray-600">{errorMessage || 'Your payment is pending or was not successful. Please try again.'}</p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/shop"
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Back to Shop
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
