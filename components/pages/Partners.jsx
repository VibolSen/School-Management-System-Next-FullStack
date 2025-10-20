
export default function Partners() {
  const partners = [
    { name: "Google", logo: "/logo/google.svg" },
    { name: "Microsoft", logo: "/logo/microsoft.svg" },
    { name: "Apple", logo: "/logo/apple.svg" },
    { name: "Amazon", logo: "/logo/amazon.svg" },
    { name: "Facebook", logo: "/logo/facebook.svg" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Partners
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We are proud to partner with these leading companies.
          </p>
        </div>

        <div className="flex justify-center items-center space-x-12">
          {partners.map((partner, index) => (
            <img
              key={index}
              src={partner.logo}
              alt={partner.name}
              className="h-12"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
