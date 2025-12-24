import React from 'react';
import './Dashboard.css';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I submit a complaint?",
      answer: "Login to your account, go to 'Raise a Complaint', fill out the form with your issue details, and submit. You'll receive a tracking ID."
    },
    {
      question: "How can I track my complaint status?",
      answer: "Use the 'Track Complaint' feature with your tracking ID to check the current status of your complaint."
    },
    {
      question: "What types of complaints can I submit?",
      answer: "You can submit complaints related to billing, service issues, technical problems, account issues, or other general concerns."
    },
    {
      question: "How long does it take to resolve a complaint?",
      answer: "Resolution time varies by complaint type. Billing issues typically take 24-48 hours, while technical issues may take up to 24 hours."
    },
    {
      question: "Can I view all my previous complaints?",
      answer: "Yes, go to 'My Complaints' section to view all your submitted complaints and their current status."
    }
  ];

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
      <div className="header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our complaint management system</p>
      </div>
      
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
              {faq.question}
            </h3>
            <p style={{ color: '#555', lineHeight: '1.6' }}>
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
      
      <div className="card" style={{ textAlign: 'center', marginTop: '30px' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
          Still have questions?
        </h3>
        <p style={{ color: '#555', marginBottom: '20px' }}>
          Contact our support team or submit a complaint for personalized assistance.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
      </div>
  );
};

export default FAQ;