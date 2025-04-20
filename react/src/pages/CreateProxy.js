import React from "react";
import { useNavigate } from "react-router-dom";
import "./create-proxy.css";

const CreateProxy = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="createProxyContainer">
      <h1 className="createProxyTitle">Create New Proxy</h1>
      <p className="createProxySubtitle">
        Empower your API by spinning up a new reverse proxy using your cloud provider of choice.
      </p>
      <div className="createProxyFormContainer">
        <div className="createProxyFormColumn createProxyLeftColumn">
          <div className="createProxyFormGroup">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" />
          </div>
          <div className="createProxyFormGroup">
            <label htmlFor="cloudRegion">Cloud Provider Region</label>
            <select id="cloudRegion">
              <option>us-east-1</option>
              <option>us-west-2</option>
              <option>eu-central-1</option>
            </select>
          </div>
          <div className="createProxyFormGroup">
            <label htmlFor="baseApiUrl">Base API URL</label>
            <input type="text" id="baseApiUrl" />
          </div>
          <div className="createProxyFormGroup">
            <label htmlFor="uploadDocs">Upload Documentation</label>
            <input type="file" id="uploadDocs" />
          </div>
          <div className="createProxyButtonRow">
            <button type="submit" className="createProxyButton">Create</button>
            <button type="button" className="cancelProxyButton" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
        <div className="createProxyFormColumn createProxyRightColumn">
          <div className="createProxyFormGroup">
            <label htmlFor="cloudProvider">Cloud Provider</label>
            <select id="cloudProvider">
              <option>Amazon Web Services</option>
              <option>Google Cloud</option>
              <option>Microsoft Azure</option>
            </select>
          </div>
          <div className="createProxyFormGroup">
            <label htmlFor="pricingPlan">Pricing Plan</label>
            <select id="pricingPlan">
              <option>Free Tier</option>
              <option>Pay-as-you-go</option>
              <option>Enterprise</option>
            </select>
          </div>
          <div className="createProxyFormGroup">
            <label htmlFor="apiType">API Request Type</label>
            <select id="apiType">
              <option>REST</option>
              <option>gRPC</option>
              <option>GraphQL</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProxy;
