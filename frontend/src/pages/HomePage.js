import React, { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    // Apply the CSS styles directly to the document
    const style = document.createElement('style');
  style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        background: #2c3e50;
        color: white;
      }
      .hero {
        text-align: center;
        padding: 100px 20px;
      }
      /* Buttons moved to header; hero contains only title and paragraph */
      .hero h1 {
        font-size: 48px;
        margin-bottom: 20px;
      }
      .hero p {
        font-size: 20px;
        color: #ecf0f1;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      <div className="hero">
        <h1>Complaint Management System</h1>
        <p>Efficiently manage and track all your complaints in one place</p>

        
      </div>
    </>
  );
};

export default HomePage;