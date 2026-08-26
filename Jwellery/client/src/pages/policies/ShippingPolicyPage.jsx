import { Helmet } from 'react-helmet-async';
export default function ShippingPolicyPage() {
  return (
    <>
      <Helmet><title>Shipping Policy — Jwellery</title></Helmet>
      <div className="container-luxury py-16 max-w-3xl">
        <h1 className="font-serif text-4xl text-gray-900 mb-8">Shipping Policy</h1>
        <div className="prose text-gray-600 space-y-4 text-sm leading-relaxed">
          <p>Last updated: July 22, 2024</p>
          <p>We ship Pan-India. Standard delivery: 5-7 days (FREE above ?999). Express: 2-3 days (?199). Orders placed before 2 PM ship the same day.</p>
        </div>
      </div>
    </>
  );
}
