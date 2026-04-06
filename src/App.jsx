import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import LoginPage from './pages/LoginPage';
import ServicesPage from './pages/ServicesPage';

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <LoginPage />;
  }

  return <ServicesPage />;
}
    </div>
  );
}
