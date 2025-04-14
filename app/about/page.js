export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About GLOSSIFY STORE</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our story, mission, and the values that drive everything we do.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-4">
              Founded in 2023, GLOSSIFY STORE began with a simple mission: to provide 
              high-quality products that enhance your everyday life. What started as a 
              small passion project has grown into a beloved brand trusted by customers 
              worldwide.
            </p>
            <p>
              Our journey began when our founder noticed a gap in the market for 
              thoughtfully designed, premium quality products that didn't break the bank. 
              Through dedication, innovation, and a commitment to exceptional quality, 
              GLOSSIFY STORE has evolved into what you see today.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p>
              At GLOSSIFY STORE, we believe in creating products that are not only 
              beautiful but also functional and sustainable. Every item in our collection 
              is thoughtfully designed and crafted to meet the highest standards of quality. 
              Our mission is to enhance your everyday life with products that combine
              aesthetic appeal, practicality, and environmental responsibility.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-bold text-xl mb-2">Quality</h3>
                <p>We never compromise on the quality of our products. Each item undergoes rigorous testing to ensure it meets our high standards.</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-bold text-xl mb-2">Sustainability</h3>
                <p>We are committed to environmentally friendly practices, from sourcing materials to packaging and shipping.</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-bold text-xl mb-2">Customer Satisfaction</h3>
                <p>Your happiness is our top priority. We strive to provide exceptional customer service and products that exceed your expectations.</p>
              </div>
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-bold text-xl mb-2">Innovation</h3>
                <p>We continuously strive to improve and innovate, bringing you the latest in design and functionality.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-6">
              Behind GLOSSIFY STORE is a dedicated team of professionals who share a passion 
              for quality, design, and customer satisfaction. From our product designers to 
              our customer service representatives, every member of our team plays an essential 
              role in delivering the GLOSSIFY experience.
            </p>
            <div className="text-center">
              <button className="bg-black text-white py-2 px-6 rounded-md hover:bg-gray-800 transition-colors">
                Join Our Team
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}