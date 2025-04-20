#include "proxy_log.h"
#include "include/nlohmann/json.hpp"

ProxyLog::ProxyLog(int proxy_log_id, int proxy_id, time_t timestamp, std::string method, std::string path, int status_code,
                   std::string request_headers, std::string response_headers, std::string request_body, std::string response_body)
    : proxy_log_id(proxy_log_id), proxy_id(proxy_id), timestamp(timestamp), method(method), path(path), status_code(status_code),
      request_headers(request_headers), response_headers(response_headers), request_body(request_body), response_body(response_body) {}

ProxyLog::ProxyLog(int proxy_id, std::string method, std::string path, int status_code,
                   std::string request_headers, std::string response_headers, std::string request_body, std::string response_body)
    : proxy_id(proxy_id), method(method), path(path), status_code(status_code), request_headers(request_headers), response_headers(response_headers), request_body(request_body), response_body(response_body) {}

int ProxyLog::getProxyLogId() { return proxy_log_id; }
int ProxyLog::getProxyId() { return proxy_id; }
time_t ProxyLog::getTimestamp() { return timestamp; }
std::string ProxyLog::getMethod() { return method; }
std::string ProxyLog::getPath() { return path; }
int ProxyLog::getStatusCode() { return status_code; }
std::string ProxyLog::getRequestHeaders() { return request_headers; }
std::string ProxyLog::getResponseHeaders() { return response_headers; }
std::string ProxyLog::getRequestBody() { return request_body; }
std::string ProxyLog::getResponseBody() { return response_body; }

// Setters
void ProxyLog::setProxyLogId(int proxy_log_id) { this->proxy_log_id = proxy_log_id; }
void ProxyLog::setProxyId(int proxy_id) { this->proxy_id = proxy_id; }
void ProxyLog::setTimestamp(time_t timestamp) { this->timestamp = timestamp; }
void ProxyLog::setMethod(std::string method) { this->method = method; }
void ProxyLog::setPath(std::string path) { this->path = path; }
void ProxyLog::setStatusCode(int status_code) { this->status_code = status_code; }
void ProxyLog::setRequestHeaders(std::string request_headers) { this->request_headers = request_headers; }
void ProxyLog::setResponseHeaders(std::string response_headers) { this->response_headers = response_headers; }
void ProxyLog::setRequestBody(std::string request_body) { this->request_body = request_body; }
void ProxyLog::setResponseBody(std::string response_body) { this->response_body = response_body; }

std::string ProxyLog::toJson()
{
    nlohmann::json jsonObj = {
        {"proxyLogId", proxy_log_id},
        {"proxyId", proxy_id},
        {"timestamp", timestamp},
        {"method", method},
        {"path", path},
        {"statusCode", status_code},
        {"requestHeaders", request_headers},
        {"responseHeaders", response_headers},
        {"requestBody", request_body},
        {"responseBody", response_body}};
    return jsonObj.dump();
}