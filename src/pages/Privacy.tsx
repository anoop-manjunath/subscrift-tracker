import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        <Link
          to="/login"
          className="inline-flex items-center text-primary hover:text-primary-glow mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Link>

        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-card border border-card-border rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground">
              This is a placeholder privacy policy page. Your actual privacy policy should be
              added here, detailing how you collect, use, and protect user data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-muted-foreground">
              Information about what data is collected and why.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
            <p className="text-muted-foreground">
              Information about how collected data is used.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Contact information for privacy-related inquiries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
