import React from 'react';

const AboutPage = () => {
  return (
    <div className="container my-5 py-5">
      {/* Brand Story Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-danger text-uppercase">Our Story</h1>
        <div className="mx-auto bg-warning" style={{ height: '4px', width: '80px' }}></div>
      </div>

      <div className="row align-items-center mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 className="h3 mb-3 text-dark">Welcome to Three Brother’s Pizza</h2>
          <p className="lead text-secondary">
            Located at <strong>256 Nguyen Van Cu Street, An Hoa Ward, Ninh Kieu District, Can Tho City</strong>, 
            Three Brother’s Pizza is more than just a restaurant—it's a destination for authentic flavor lovers.
          </p>
          <p className="text-muted">
            Our journey began with a simple mission: to provide a cozy atmosphere and high-quality 
            pizzas for the local community. To serve you better, we have transformed from manual 
            operations into a modern e-commerce platform, ensuring every order is processed 
            with speed, accuracy, and care.
          </p>
          <div className="d-flex gap-3 mt-4">
            <div className="text-center p-3 border rounded bg-light flex-fill shadow-sm">
              <h4 className="text-danger mb-0 fw-bold">100%</h4>
              <small className="text-uppercase fw-semibold">Fresh Ingredients</small>
            </div>
            <div className="text-center p-3 border rounded bg-light flex-fill shadow-sm">
              <h4 className="text-danger mb-0 fw-bold">24/7</h4>
              <small className="text-uppercase fw-semibold">Online Support</small>
            </div>
          </div>
        </div>
        <div className="col-lg-6 px-lg-5">
          <div className="position-relative">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000" 
              alt="Authentic Pizza" 
              className="img-fluid rounded shadow-lg border border-5 border-white"
            />
          </div>
        </div>
      </div>

      {/* Why Choose Us / Values */}
      <div className="row g-4 mt-4">
        <div className="col-md-4 text-center">
          <div className="card h-100 border-0 shadow-sm p-4 hover-shadow">
            <div className="mb-3 display-5 text-warning">🍕</div>
            <h3 className="h5 fw-bold">Quality Products</h3>
            <p className="text-muted small">
              Real-time menu updates with clear pricing and exciting promotions. We guarantee the best taste in every slice.
            </p>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="card h-100 border-0 shadow-sm p-4 hover-shadow">
            <div className="mb-3 display-5 text-warning">💻</div>
            <h3 className="h5 fw-bold">Smart Experience</h3>
            <p className="text-muted small">
              An intuitive system for searching products, tracking orders, and managing your personal account with ease.
            </p>
          </div>
        </div>
        <div className="col-md-4 text-center">
          <div className="card h-100 border-0 shadow-sm p-4 hover-shadow">
            <div className="mb-3 display-5 text-warning">💬</div>
            <h3 className="h5 fw-bold">Customer Connection</h3>
            <p className="text-muted small">
              Share your thoughts through reviews and receive instant support via our integrated messaging system.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="mt-5 p-5 bg-dark text-white rounded shadow text-center position-relative overflow-hidden" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=1000")', 
             backgroundPosition: 'center',
             backgroundSize: 'cover' 
           }}>
        <h2 className="display-6 fw-bold mb-3">Ready to Taste the Difference?</h2>
        <p className="mb-4 lead">Experience the perfect blend of traditional recipes and modern convenience.</p>
        <div className="h3 fw-bold text-warning mb-4">Hotline: 1900 6066</div>
        <button className="btn btn-danger btn-lg px-5 py-3 rounded-pill fw-bold shadow">ORDER NOW</button>
      </div>
    </div>
  );
};

export default AboutPage;