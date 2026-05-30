'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export function ApiStatus() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'partial' | 'offline'>(
    'checking',
  );
  const [detail, setDetail] = useState('');

  useEffect(() => {
    api
      .health()
      .then((r) => {
        if (r.status === 'ok' && r.database === 'connected') {
          setStatus('ok');
          setDetail('API + PostgreSQL connected');
        } else if (r.status === 'ok') {
          setStatus('partial');
          setDetail('API online · database offline (using browser storage)');
        } else {
          setStatus('partial');
          setDetail('API running · database not ready');
        }
      })
      .catch(() => {
        setStatus('offline');
        setDetail('API offline · calculator runs locally in your browser');
      });
  }, []);

  return (
    <div className="status-bar">
      <span
        className={`status-dot ${
          status === 'ok' ? 'ok' : status === 'partial' ? 'ok' : status === 'offline' ? 'err' : ''
        }`}
      />
      <span>
        {status === 'checking' && 'Checking connection…'}
        {status !== 'checking' && detail}
      </span>
    </div>
  );
}
