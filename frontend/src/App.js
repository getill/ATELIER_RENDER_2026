import React, { useState, useEffect } from 'react';

function App() {
  // URLs configuration
  const [flaskUrl, setFlaskUrl] = useState(() => {
    return localStorage.getItem('flask_url') || '';
  });
  const [adminerUrl, setAdminerUrl] = useState(() => {
    return localStorage.getItem('adminer_url') || '';
  });
  const [dbName, setDbName] = useState(() => {
    return localStorage.getItem('db_name') || 'render_db';
  });

  // Save inputs to localStorage
  useEffect(() => {
    localStorage.setItem('flask_url', flaskUrl);
  }, [flaskUrl]);

  useEffect(() => {
    localStorage.setItem('adminer_url', adminerUrl);
  }, [adminerUrl]);

  useEffect(() => {
    localStorage.setItem('db_name', dbName);
  }, [dbName]);

  // API Tester States
  const [selectedRoute, setSelectedRoute] = useState('/');
  const [apiResponse, setApiResponse] = useState('Cliquez sur "Tester la route" pour envoyer une requête.');
  const [apiStatus, setApiStatus] = useState(null); // 'success', 'error', 'loading'
  const [statusCode, setStatusCode] = useState(null);

  // Status Indicator States
  const [flaskStatus, setFlaskStatus] = useState('warning'); // 'active', 'warning', 'danger'
  const [dbStatus, setDbStatus] = useState('warning'); // 'active', 'warning'

  // Test connection to Flask
  const checkFlaskHealth = async () => {
    if (!flaskUrl) {
      setFlaskStatus('warning');
      return;
    }
    try {
      const response = await fetch(`${flaskUrl}/health`);
      if (response.ok) {
        setFlaskStatus('active');
      } else {
        setFlaskStatus('danger');
      }
    } catch (e) {
      setFlaskStatus('danger');
    }
  };

  useEffect(() => {
    checkFlaskHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flaskUrl]);

  // Execute API Request
  const testApiRoute = async () => {
    if (!flaskUrl) {
      setApiResponse('Veuillez spécifier l\'URL de votre API Flask d\'abord.');
      setApiStatus('error');
      setStatusCode(400);
      return;
    }

    setApiStatus('loading');
    setApiResponse('Appel de l\'API en cours...');
    setStatusCode(null);

    const cleanUrl = flaskUrl.endsWith('/') ? flaskUrl.slice(0, -1) : flaskUrl;
    const targetUrl = `${cleanUrl}${selectedRoute}`;

    try {
      const response = await fetch(targetUrl);
      setStatusCode(response.status);
      
      const contentType = response.headers.get('content-type');
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        setApiResponse(JSON.stringify(data, null, 2));
      } else {
        data = await response.text();
        setApiResponse(data);
      }

      if (response.ok) {
        setApiStatus('success');
        if (selectedRoute === '/health') {
          setFlaskStatus('active');
        }
      } else {
        setApiStatus('error');
      }
    } catch (err) {
      setApiStatus('error');
      setStatusCode('Network Error');
      setApiResponse(`Erreur de connexion :\nImpossible de joindre le serveur à l'adresse ${targetUrl}.\nVérifiez que le CORS est activé ou que l'URL est correcte.`);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="badge-platform">Atelier Render 2026</div>
        <h1 className="app-title">Portail Développeur</h1>
        <p className="app-subtitle">
          Votre environnement de développement cloud complet. Suivez l'état de vos microservices, testez vos APIs en temps réel et gérez vos bases de données.
        </p>
      </header>

      {/* Grid Dashboard */}
      <div className="dashboard-grid">
        
        {/* Service 1: React Frontend */}
        <div className="glass-card span-6">
          <div className="card-header-flex">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Frontend React
            </h2>
            <div className="status-indicator" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <span className="status-dot active"></span>
              <span className="status-text">Actif</span>
            </div>
          </div>
          <p className="card-description">
            Ce site statique déployé de manière indépendante offre une interface utilisateur fluide et réactive pour piloter vos services backend.
          </p>
          <div className="service-details">
            <div className="detail-row">
              <span className="detail-label">Runtime</span>
              <span className="detail-value">React 18 (Static)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Dossier Racine</span>
              <span className="detail-value">/frontend</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Build Command</span>
              <span className="detail-value">npm run build</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <span className="btn-secondary" style={{ cursor: 'default', opacity: 0.8 }}>
              Déployé automatiquement
            </span>
          </div>
        </div>

        {/* Service 2: Flask Backend */}
        <div className="glass-card span-6">
          <div className="card-header-flex">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              Backend Flask
            </h2>
            <div className="status-indicator" style={{ 
              background: flaskStatus === 'active' ? 'rgba(16, 185, 129, 0.1)' : flaskStatus === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
              color: flaskStatus === 'active' ? '#10b981' : flaskStatus === 'warning' ? '#f59e0b' : '#ef4444' 
            }}>
              <span className={`status-dot ${flaskStatus}`}></span>
              <span className="status-text">
                {flaskStatus === 'active' ? 'En ligne' : flaskStatus === 'warning' ? 'Non configuré' : 'Hors ligne'}
              </span>
            </div>
          </div>
          <p className="card-description">
            Web service RESTful écrit en Python. Il traite les requêtes métiers et interagit avec la base de données PostgreSQL.
          </p>
          <div className="service-details">
            <div className="detail-row">
              <span className="detail-label">Hébergeur</span>
              <span className="detail-value">Render Web Service</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Provisionné par</span>
              <span className="detail-value">Terraform IaC</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Conteneur</span>
              <span className="detail-value">Docker (Python 3.12)</span>
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="flask-url-input">URL de votre Flask déployé</label>
            <div className="input-wrapper">
              <input 
                id="flask-url-input"
                type="text" 
                className="text-input" 
                placeholder="https://flask-render-iac-actor.onrender.com"
                value={flaskUrl}
                onChange={(e) => setFlaskUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Service 3: PostgreSQL Database */}
        <div className="glass-card span-6">
          <div className="card-header-flex">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
              </svg>
              BDD PostgreSQL
            </h2>
            <div className="status-indicator" style={{ 
              background: dbStatus === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
              color: dbStatus === 'active' ? '#10b981' : '#f59e0b' 
            }}>
              <span className={`status-dot ${dbStatus}`}></span>
              <span className="status-text">{dbStatus === 'active' ? 'Connecté' : 'À configurer'}</span>
            </div>
          </div>
          <p className="card-description">
            Base de données relationnelle managée de production PostgreSQL fournie nativement par Render pour stocker vos données de manière persistante.
          </p>
          <div className="info-box">
            <div className="info-box-title">
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Comment lier PostgreSQL à Flask ?
            </div>
            <p className="info-box-text">
              Créez votre BDD dans Render (<strong>New &rarr; Database</strong>), puis injectez sa <code>Internal Database URL</code> dans votre service Flask en tant que variable d'environnement <code>DATABASE_URL</code>.
            </p>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="db-name-input">Nom de la BDD (Facultatif)</label>
            <input 
              id="db-name-input"
              type="text" 
              className="text-input" 
              value={dbName}
              onChange={(e) => {
                setDbName(e.target.value);
                setDbStatus(e.target.value ? 'active' : 'warning');
              }}
            />
          </div>
        </div>

        {/* Service 4: Adminer Manager */}
        <div className="glass-card span-6">
          <div className="card-header-flex">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              Adminer (Gestion BDD)
            </h2>
            <div className="status-indicator" style={{ 
              background: adminerUrl ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
              color: adminerUrl ? '#10b981' : '#f59e0b' 
            }}>
              <span className={`status-dot ${adminerUrl ? 'active' : 'warning'}`}></span>
              <span className="status-text">{adminerUrl ? 'Prêt' : 'En attente'}</span>
            </div>
          </div>
          <p className="card-description">
            Outil d'administration de base de données ultra-léger et complet. Permet de visualiser vos tables, lancer des requêtes SQL et structurer vos données.
          </p>
          <div className="service-details">
            <div className="detail-row">
              <span className="detail-label">Image Docker</span>
              <span className="detail-value">adminer:latest</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Provisionné par</span>
              <span className="detail-value">Terraform IaC</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Port par défaut</span>
              <span className="detail-value">8080 (Docker Expose)</span>
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" htmlFor="adminer-url-input">URL de votre Adminer déployé</label>
            <input 
              id="adminer-url-input"
              type="text" 
              className="text-input" 
              placeholder="https://adminer-iac-actor.onrender.com"
              value={adminerUrl}
              onChange={(e) => setAdminerUrl(e.target.value)}
            />
          </div>
          {adminerUrl ? (
            <a 
              id="adminer-link"
              href={adminerUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
            >
              Ouvrir Adminer dans un nouvel onglet
              <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          ) : (
            <button className="btn-secondary" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
              Renseigner l'URL pour ouvrir
            </button>
          )}
        </div>

        {/* Console / API Tester client */}
        <div className="glass-card span-12 tester-panel">
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5"></polyline>
              <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
            Testeur d'API Backend (Flask)
          </h2>
          <p className="card-description" style={{ minHeight: 'auto', marginBottom: '1.5rem' }}>
            Sélectionnez une route exposée par votre service Flask pour tester la communication client-serveur.
          </p>

          <div className="endpoint-selector">
            <button 
              id="route-home"
              className={`endpoint-btn ${selectedRoute === '/' ? 'active' : ''}`}
              onClick={() => setSelectedRoute('/')}
            >
              GET /
            </button>
            <button 
              id="route-health"
              className={`endpoint-btn ${selectedRoute === '/health' ? 'active' : ''}`}
              onClick={() => setSelectedRoute('/health')}
            >
              GET /health
            </button>
            <button 
              id="route-info"
              className={`endpoint-btn ${selectedRoute === '/info' ? 'active' : ''}`}
              onClick={() => setSelectedRoute('/info')}
            >
              GET /info
            </button>
            <button 
              id="route-env"
              className={`endpoint-btn ${selectedRoute === '/env' ? 'active' : ''}`}
              onClick={() => setSelectedRoute('/env')}
            >
              GET /env
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="service-details" style={{ margin: 0 }}>
                <div className="detail-row">
                  <span className="detail-label">Endpoint ciblé</span>
                  <span className="detail-value" style={{ color: '#a5b4fc' }}>{selectedRoute}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Méthode HTTP</span>
                  <span className="detail-value" style={{ color: '#34d399' }}>GET</span>
                </div>
              </div>
              <button 
                id="send-request"
                className="btn-primary" 
                onClick={testApiRoute}
                disabled={apiStatus === 'loading'}
              >
                {apiStatus === 'loading' ? (
                  <>
                    <span className="rotate-anim">&#8635;</span>
                    Appel en cours...
                  </>
                ) : (
                  <>
                    Envoyer la requête
                    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div className="response-card">
              <div className="response-header">
                <span className="response-title">Console HTTP</span>
                {statusCode && (
                  <span className={`response-badge ${apiStatus === 'success' ? 'success' : 'error'}`}>
                    Status: {statusCode}
                  </span>
                )}
              </div>
              <pre id="response-output" className="response-body" style={{ color: apiStatus === 'error' ? '#f87171' : apiStatus === 'success' ? '#34d399' : '#94a3b8' }}>
                {apiResponse}
              </pre>
            </div>
          </div>
        </div>

        {/* PostgreSQL Guide Panel */}
        <div className="glass-card span-12" style={{ marginTop: '1.5rem' }}>
          <h2 className="card-title" style={{ marginBottom: '1.5rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Guide d'orchestration de la plateforme
          </h2>
          <div className="postgres-steps">
            <div className="postgres-step">
              <div className="step-num">1</div>
              <div className="step-content">
                <span className="step-highlight">Provisionnement Terraform :</span> Poussez vos modifications. Le workflow GitHub exécutera automatiquement <code>terraform apply</code> pour déployer votre <strong>Flask</strong> backend et <strong>Adminer</strong>. Copiez leurs URLs respectives depuis l'interface Render et collez-les dans les champs ci-dessus.
              </div>
            </div>
            <div className="postgres-step">
              <div className="step-num">2</div>
              <div className="step-content">
                <span className="step-highlight">Création PostgreSQL :</span> Dans Render, cliquez sur <strong>New &rarr; PostgreSQL</strong>. Donnez-lui le nom <code>{dbName}</code>, choisissez la région <code>Frankfurt (eu-central)</code> pour minimiser la latence, puis cliquez sur <strong>Create Database</strong>.
              </div>
            </div>
            <div className="postgres-step">
              <div className="step-num">3</div>
              <div className="step-content">
                <span className="step-highlight">Liaison des Services :</span> Récupérez la <strong>Internal Database URL</strong> de PostgreSQL sur Render. Dans Render, éditez votre Web Service Flask et ajoutez une variable d'environnement <code>DATABASE_URL</code> avec cette valeur. Pour Adminer, vous pourrez utiliser la <strong>External Database URL</strong> (Host, User, Password) pour vous connecter directement via le portail Adminer.
              </div>
            </div>
            <div className="postgres-step">
              <div className="step-num">4</div>
              <div className="step-content">
                <span className="step-highlight">Création du Static Site :</span> Dans Render, cliquez sur <strong>New &rarr; Static Site</strong>. Sélectionnez votre repository public, nommez le site <code>frontend-render-iac</code>, spécifiez le <strong>Root Directory</strong> par <code>frontend</code>, le <strong>Build Command</strong> par <code>npm run build</code>, et enfin le <strong>Publish Directory</strong> par <code>build</code>.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
