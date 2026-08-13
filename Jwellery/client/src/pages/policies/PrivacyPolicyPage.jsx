import { Helmet } from 'react-helmet-async';
export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet><title>Privacy Policy — Jwellery</title></Helmet>
      <div className="container-luxury py-16 max-w-3xl">
        <h1 className="font-serif text-4xl text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose text-gray-600 space-y-4 text-sm leading-relaxed">
          <p>Last updated: July 22, 2024</p>
          <p>We collect your name, email, phone, and address only to process orders and improve your shopping experience. We never sell your data.</p>
        </div>
      </div>
    </>
  );
}
