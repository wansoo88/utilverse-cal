import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'utilverse — Free Online Calculators & Tools'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
            borderRadius: '16px',
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
          }}>
            ⚡
          </div>
          <span style={{
            fontSize: '48px',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3b82f6, #10b981)',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            utilverse
          </span>
        </div>

        {/* Tagline */}
        <p style={{ fontSize: '28px', color: '#94a3b8', textAlign: 'center', margin: '0 0 48px', maxWidth: '700px' }}>
          Free Online Calculators &amp; Tools
        </p>

        {/* Tool pills */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['⚡ EV Charging', '🍳 Air Fryer', '🖨️ 3D Printing', '📏 Unit Converter', '🚗 EV vs Gas'].map((tool) => (
            <div key={tool} style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '100px',
              padding: '10px 24px',
              fontSize: '18px',
              color: '#93c5fd',
            }}>
              {tool}
            </div>
          ))}
        </div>

        {/* URL */}
        <p style={{ position: 'absolute', bottom: '40px', fontSize: '18px', color: '#475569' }}>
          utilverse.info
        </p>
      </div>
    ),
    { ...size }
  )
}
