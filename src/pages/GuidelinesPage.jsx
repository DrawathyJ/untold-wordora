import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Feather, EyeOff, Heart, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function GuidelinesPage() {
  return (
    <div className="reading-container animate-fade-in" style={{ padding: '3.5rem 0 6rem' }}>
      {/* Back button */}
      <Link to="/" className="btn btn-ghost" style={{ paddingLeft: 0, marginBottom: '2.5rem', gap: '0.4rem' }}>
        <ArrowLeft size={16} />
        <span>Back to Feed</span>
      </Link>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem',
        color: '#ffffff'
      }}>
        <Shield size={20} />
        <span style={{ fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          Community Ethos & Safety
        </span>
      </div>

      <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2.8rem', fontWeight: 400, lineHeight: 1.2, marginBottom: '1.75rem' }}>
        A sanctuary for honesty, not for harm.
      </h1>

      <p style={{ fontFamily: 'var(--font-reading-serif)', fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '3.5rem' }}>
        UNFILTERED was created because the modern internet has become an audition where everyone feels compelled to perform happiness, success, and poise. Here, you are free to share what is messy, unresolved, and real. With that freedom comes a shared responsibility.
      </p>

      {/* Principle 1 */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Heart size={18} color="#ffffff" />
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 500 }}>1. The "I Relate" Ethos</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          We replaced traditional vanity numbers with <strong>"I relate"</strong>. Writing about emotional pain, imposter syndrome, or sudden heartbreak isn't a ploy for engagement — it's an invitation for human solidarity. When you press "I relate", you are signaling to another soul: <em>"You are not alone in feeling this way."</em>
        </p>
      </section>

      {/* Principle 2 */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <EyeOff size={18} color="#ffffff" />
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 500 }}>2. Realities & Limits of Anonymous Publishing</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
          When you toggle <strong>"Publish Anonymously"</strong>, the platform detaches your username, avatar, and profile from the public feed. Other readers only see <em>"Anonymous Soul"</em>.
        </p>
        <div style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          fontSize: '0.88rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.7
        }}>
          <strong style={{ color: '#ffffff' }}>Important Privacy Limitations:</strong>
          <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Anonymity hides your user metadata from the public frontend interface.</li>
            <li>If you write highly specific details (e.g. naming your workplace, unique personal events, or exact dates), people in your life could deduce your identity.</li>
            <li>Never include phone numbers, addresses, private passwords, or third-party secrets.</li>
          </ul>
        </div>
      </section>

      {/* Principle 3 */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <AlertTriangle size={18} color="#ffffff" />
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 500 }}>3. Boundaries We Enforce</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
          Vulnerability is encouraged; malice is strictly prohibited. Stories containing the following will be removed upon report review:
        </p>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><strong>Doxxing:</strong> Exposing another person’s real name, private phone number, residence, or workplace without explicit consent.</li>
          <li><strong>Harassment & Threats:</strong> Targeting individuals with targeted insults, threats of bodily harm, or intimidation.</li>
          <li><strong>Hate Speech:</strong> Attacking marginalized groups based on race, gender, sexual orientation, religion, or disability.</li>
          <li><strong>Spam & SEO hijacking:</strong> Commercial promotions, affiliate dumps, and malicious hyperlinks.</li>
        </ul>
      </section>

      {/* Principle 4 */}
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <CheckCircle2 size={18} color="#ffffff" />
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 500 }}>4. Reporting & Moderation</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          Every story features a discreet flag icon. Reports are submitted directly to the PostgreSQL database with the reporter's context and queued for review. If a story violates these standards, it is un-published immediately.
        </p>
      </section>

      {/* Call to action */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)'
      }}>
        <Feather size={28} color="#ffffff" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 500, marginBottom: '0.5rem' }}>Ready to write?</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Take a deep breath. You don't have to get the words right.
        </p>
        <Link to="/write" className="btn btn-primary">
          Open Your Blank Page
        </Link>
      </div>
    </div>
  );
}
