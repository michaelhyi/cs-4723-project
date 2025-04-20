import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleCreateProxy = () => {
    navigate('/proxy/create');
  };

  const handleRowClick = (proxyId) => {
    navigate(`/proxy/${proxyId}`);
  };

  const proxies = [
    {
      id: "infra-api-gateway-3b3fe1b4-9ae7",
      name: 'E-Commerce Store API',
      status: 'Running',
      cloudProvider: 'Amazon Web Services',
      cloudRegion: 'us-east-1',
      pricing: 'Free Tier',
      proxyUrl: 'https://micro.apiveil.com',
      baseApiUrl: 'https://shop.company.com',
      apiProtocol: 'HTTP',
    },
    {
      id: "microservices-api-gateway",
      name: 'Microservices API Gateway',
      status: 'Running',
      cloudProvider: 'Microsoft Azure',
      cloudRegion: 'East US',
      pricing: 'Enterprise',
      proxyUrl: 'http://micro.apiveil.com',
      baseApiUrl: 'https://micro.company.com',
      apiProtocol: 'gRPC',
    },
  ];

  return (
    <div>
      <nav className="top-nav">
        <h1 className="dashboard-title">Developer Dashboard</h1>
        <div className="nav-right">
          <button className="btn-create" onClick={handleCreateProxy}>
            Create Proxy
          </button>
          <div className="user-dropdown">
            <img
              className="user-avatar"
              src="icons/user-avatar.svg"
              alt="User Avatar"
            />
          </div>
        </div>
      </nav>

      <main className="container">
        <p>Manage all running reverse proxies and servers.</p>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Cloud Provider</th>
              <th>Cloud Region</th>
              <th>Pricing</th>
              <th>Proxy URL</th>
              <th>Base API URL</th>
              <th>API Protocol</th>
            </tr>
          </thead>
          <tbody>
            {proxies.map((proxy) => (
              <tr key={proxy.id} onClick={() => handleRowClick(proxy.id)}>
                <td>{proxy.name}</td>
                <td className={proxy.status === 'Running' ? 'status-running' : ''}>
                  {proxy.status}
                </td>
                <td>{proxy.cloudProvider}</td>
                <td>{proxy.cloudRegion}</td>
                <td>{proxy.pricing}</td>
                <td>{proxy.proxyUrl}</td>
                <td>{proxy.baseApiUrl}</td>
                <td>{proxy.apiProtocol}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-controls">
          <p>Page 1 / 3</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
