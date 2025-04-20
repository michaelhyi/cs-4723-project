import React from "react";
import { useParams, Link } from "react-router-dom";
import "./styles.css";

const ViewProxy = () => {
  const { proxyId } = useParams();

  return (
    <main className="container">
      <Link className="back-link" to="/dashboard">
        &larr;&nbsp;&nbsp;Back to Home
      </Link>
      <h1 className="proxy-name">{proxyId}</h1>
      <div className="metadata">
        <p>
          <span className="metadata-key">Cloud Provider:</span>
          <span className="metadata-value">Amazon Web Services</span>
        </p>
        <p>
          <span className="metadata-key">Cloud Provider Region:</span>
          <span className="metadata-value">us-east-2</span>
        </p>
        <p>
          <span className="metadata-key">Pricing Plan:</span>
          <span className="metadata-value">Free Tier</span>
        </p>
        <p>
          <span className="metadata-key">API Request Type:</span>
          <span className="metadata-value">HTTP</span>
        </p>
      </div>
      <div className="metadata">
        <p>
          <span className="metadata-key">Proxy URL:</span>
          <span className="metadata-value">
            https://0bd62e53-cf86-4734-ab94-4eb4dd62c974.apiveil.com/
          </span>
        </p>
        <p>
          <span className="metadata-key">Base API URL:</span>
          <span className="metadata-value">
            https://infra-api-gateway-3b3fe1b4-9ae7.company.com/
          </span>
        </p>
      </div>
      <div id="logs" className="logs"></div>
    </main>
  );
};

export default ViewProxy;
