'use client';

export default function OpenSupportButton() {
  const openSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    const api = (window as any).Tawk_API;
    if (api && typeof api.toggle === 'function') {
      api.toggle(); // toggles widget
    } else if (api && typeof api.maximize === 'function') {
      api.maximize();
    } else {
      // fallback: navigate to docs support page
      window.open('/docs/external/support', '_blank');
    }
  };

  return (
    <button onClick={openSupport} className="btn btn-primary">
      Contact Support
    </button>
  );
}

