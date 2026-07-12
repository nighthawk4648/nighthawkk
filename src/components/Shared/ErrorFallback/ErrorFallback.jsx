import { FaExclamationTriangle } from 'react-icons/fa';

export const ErrorFallback = () => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
            zIndex: 9999,
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                padding: '2rem 2.5rem',
                background: '#fff',
                maxWidth: '400px',
            }}>
                <FaExclamationTriangle size={48} color="#e53e3e" style={{ marginBottom: '1rem' }} />
                <h2 style={{ color: '#1a202c', marginBottom: '0.5rem', fontWeight: 600 }}>Something went wrong</h2>
                <p style={{ color: '#4a5568', fontSize: '1rem', textAlign: 'center' }}>
                    Please try refreshing the page or contact support if the problem persists.
                </p>
            </div>
        </div>
    );
};