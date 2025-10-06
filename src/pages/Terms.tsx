import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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

        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="bg-card border border-card-border rounded-lg p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground">
              This is a placeholder terms of service page. Your actual terms should be added here,
              detailing the rules and guidelines for using your service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
            <p className="text-muted-foreground">
              Information about user obligations and acceptable use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p className="text-muted-foreground">
              Information about service limitations and disclaimers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Contact information for terms-related inquiries.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
