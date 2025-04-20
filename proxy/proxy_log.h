#include <string>
#include <ctime>
#include <map>

#ifndef PROXY_LOG_H
#define PROXY_LOG_H

class ProxyLog {
private:
    int proxy_log_id;
    int proxy_id;
    time_t timestamp;
    std::string method;
    std::string path;
    int status_code;
    std::string request_headers;
    std::string response_headers;
    std::string request_body;
    std::string response_body;

public:
    ProxyLog(int proxy_log_id, int proxy_id, time_t timestamp, std::string method, std::string path, int status_code,
        std::string request_headers, std::string response_headers, std::string request_body, std::string response_body);
    ProxyLog(int proxy_id, std::string method, std::string path, int status_code,
        std::string request_headers, std::string response_headers, std::string request_body, std::string response_body);

    int getProxyLogId();
    int getProxyId();
    time_t getTimestamp();
    std::string getMethod();
    std::string getPath();
    int getStatusCode();
    std::string getRequestHeaders();
    std::string getResponseHeaders();
    std::string getRequestBody();
    std::string getResponseBody();

    void setProxyLogId(int proxy_log_id);
    void setProxyId(int proxy_id);
    void setTimestamp(time_t timestamp);
    void setMethod(std::string method);
    void setPath(std::string path);
    void setStatusCode(int status_code);
    void setRequestHeaders(std::string request_headers);
    void setResponseHeaders(std::string response_headers);
    void setRequestBody(std::string request_body);
    void setResponseBody(std::string response_body);

    std::string toString();
    std::string toJson();
    static ProxyLog fromJson(std::string json);
};

#endif