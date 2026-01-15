import React from 'react';

const ContactPage = () => {
  // Link embed với Place ID để hiển thị marker chính xác
  // Place ID của The Pizza Company Mậu Thân: ChIJ... (cần lấy từ Google Maps)
  // Hoặc dùng link embed trực tiếp từ Google Maps
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8474!2d105.77346!3d10.03436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a062a269227f4d%3A0xc665191f6920970a!2sThe%20Pizza%20Company%20M%E1%BA%ADu%20Th%C3%A2n!5e0!3m2!1svi!2s!4v1709123456789!5m2!1svi!2s";

  return (
    <div className="container my-5 py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-danger text-uppercase">Contact Us</h1>
        <p className="text-muted">Have a question or want to order? We're here to help!</p>
        <div className="mx-auto bg-warning" style={{ height: '4px', width: '80px' }}></div>
      </div>

      <div className="row g-5">
        {/* Left Side: Contact Information */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100 bg-light">
            <h3 className="h4 fw-bold mb-4 text-dark border-bottom pb-2">Get In Touch</h3>
            
            <div className="d-flex mb-4">
              <div className="text-danger me-3 fs-3">
                <i className="bi bi-geo-alt-fill">📍</i>
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Address</h5>
                <p className="text-muted mb-0">
                  17 Đ. Mậu Thân, An Hòa, Ninh Kiều, Cần Thơ
                </p>
              </div>
            </div>

            <div className="d-flex mb-4">
              <div className="text-danger me-3 fs-3">
                <i className="bi bi-telephone-fill">📞</i>
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Phone Number</h5>
                <p className="mb-0 text-dark fw-bold">1900 6066</p>
                <p className="text-muted mb-0 small">(+84) 292 3811 811</p>
              </div>
            </div>

            <div className="d-flex mb-4">
              <div className="text-danger me-3 fs-3">
                <i className="bi bi-envelope-fill">✉️</i>
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Email</h5>
                <p className="text-muted mb-0">info@threebrotherspizza.vn</p>
              </div>
            </div>

            <div className="d-flex">
              <div className="text-danger me-3 fs-3">
                <i className="bi bi-clock-fill">⏰</i>
              </div>
              <div>
                <h5 className="mb-1 fw-bold">Opening Hours</h5>
                <p className="text-muted mb-0">Mon - Sun: 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Google Maps with Marker */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ minHeight: '450px' }}>
            {/* Dùng link embed trực tiếp từ Google Maps để đảm bảo có marker */}
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3709.094209569203!2d105.7696481284727!3d10.03278537086897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08929bac2e6dd%3A0x35f12d612072a471!2sThe%20Pizza%20Company%20M%E1%BA%ADu%20Th%C3%A2n!5e1!3m2!1svi!2s!4v1768319059038!5m2!1svi!2s" 
                  width="600" 
                  height="450" 
                  style={{border: 0}}
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

      {/* Contact Form below */}
      <div className="mt-5 p-5 bg-white shadow-sm rounded border">
        <div className="row justify-content-center text-center mb-4">
           <div className="col-lg-6">
              <h3 className="fw-bold">Send Us a Message</h3>
              <p className="text-muted">We will get back to you as soon as possible.</p>
           </div>
        </div>
        <form className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Your Name</label>
            <input type="text" className="form-control form-control-lg border-2 shadow-none" placeholder="Enter your name" required />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Your Email</label>
            <input type="email" className="form-control form-control-lg border-2 shadow-none" placeholder="Enter your email" required />
          </div>
          <div className="col-12">
            <label className="form-label fw-semibold">Message</label>
            <textarea className="form-control form-control-lg border-2 shadow-none" rows={4} placeholder="How can we help you?" required></textarea>
          </div>
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-danger btn-lg px-5 rounded-pill shadow fw-bold">SEND MESSAGE</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;