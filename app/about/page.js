import React from 'react';

export default function AboutPage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>About StylishAI</h1>
      <p>
        StylishAI harnesses the power of artificial intelligence to deliver personalized fashion recommendations. By analyzing user input, preferences, and body measurements, StylishAI offers tailored clothing suggestions and a virtual try-on experience, making online shopping smarter and more intuitive.
      </p>
      <p>
        Our mission is to bridge the gap between technology and fashion, helping users discover styles that suit their unique tastes and needs. With features like AI-driven recommendations, style analytics, and seamless integration, StylishAI is your go-to platform for a smarter, more enjoyable fashion journey.
      </p>
      <div style={{marginTop: '2rem', color: '#3730a3', fontWeight: 600}}>
        <span>Created by Rahul Srivasava</span>
      </div>
    </main>
  );
}
