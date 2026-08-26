import { Helmet } from 'react-helmet-async';
export default function TermsPage() {
  return (
    <>
      <Helmet><title>Terms of Service — Jwellery</title></Helmet>
      <div className="container-luxury py-16 max-w-3xl">
        <h1 className="font-serif text-4xl text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose text-gray-600 space-y-4 text-sm leading-relaxed">
          <p>Last updated: July 22, 2024</p>
          <p>By using Jwellery, you agree to our terms. All prices are in INR and include GST. Designs are property of Jwellery.</p>
        </div>
      </div>
    </>
  );
}
