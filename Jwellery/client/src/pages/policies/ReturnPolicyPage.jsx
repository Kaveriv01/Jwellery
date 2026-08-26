import { Helmet } from 'react-helmet-async';
export default function ReturnPolicyPage() {
  return (
    <>
      <Helmet><title>Return & Exchange Policy — Jwellery</title></Helmet>
      <div className="container-luxury py-16 max-w-3xl">
        <h1 className="font-serif text-4xl text-gray-900 mb-8">Return & Exchange Policy</h1>
        <div className="prose text-gray-600 space-y-4 text-sm leading-relaxed">
          <p>Last updated: July 22, 2024</p>
          <p>We accept returns within 7 days of delivery. Items must be unused, undamaged, and in original packaging. Refunds are processed within 5-7 business days.</p>
        </div>
      </div>
    </>
  );
}
