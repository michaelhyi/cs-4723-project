#include <iostream>
#include <cstdio>
#include <cstdlib>
#include "proxy_log_dao.h"

PGconn* ProxyLogDao::conn = nullptr;

int ProxyLogDao::setConnnection() {
    const char* host = std::getenv("DB_HOST");
    const char* dbname = std::getenv("DB_NAME");
    const char* user = std::getenv("DB_USER");
    const char* password = std::getenv("DB_PASSWORD");

    std::string conninfo = "host=";
    conninfo += (host ? host : "localhost");
    conninfo += " dbname=";
    conninfo += (dbname ? dbname : "apiveil");
    conninfo += " user=";
    conninfo += (user ? user : "postgres");
    if (password) {
        conninfo += " password=";
        conninfo += password;
    }
    conn = PQconnectdb(conninfo.c_str());

    if (PQstatus(conn) != CONNECTION_OK) {
        fprintf(stderr, "Connection to database failed: %s", PQerrorMessage(conn));
        PQfinish(conn);
        return -1;
    }

    return 0;
}

void ProxyLogDao::createProxyLog(ProxyLog *proxyLog) {
    if (conn == nullptr) {
        throw std::runtime_error("Database connection is not established.");
    }

    char *escaped_method = PQescapeLiteral(conn, proxyLog->getMethod().c_str(), proxyLog->getMethod().length());
    char *escaped_path = PQescapeLiteral(conn, proxyLog->getPath().c_str(), proxyLog->getPath().length());
    char *escaped_request_headers = PQescapeLiteral(conn, proxyLog->getRequestHeaders().c_str(), proxyLog->getRequestHeaders().length());
    char *escaped_response_headers = PQescapeLiteral(conn, proxyLog->getResponseHeaders().c_str(), proxyLog->getResponseHeaders().length());
    char *escaped_request_body = PQescapeLiteral(conn, proxyLog->getRequestBody().c_str(), proxyLog->getRequestBody().length());
    char *escaped_response_body = PQescapeLiteral(conn, proxyLog->getResponseBody().c_str(), proxyLog->getResponseBody().length());

    if (!escaped_method || !escaped_path || !escaped_request_headers || !escaped_response_headers || !escaped_request_body || !escaped_response_body) {
        std::cerr << "Error escaping string values.\n";
        throw std::runtime_error("Failed to escape string values.");
    }

    char sql[65535];
    sprintf(
        sql,
        "INSERT INTO public.proxy_log (proxy_id, method, path, status_code, request_headers, response_headers, request_body, response_body)"
        "VALUES (%d, %s, %s, %d, %s, %s, %s, %s) RETURNING proxy_log_id, timestamp",
        proxyLog->getProxyId(),
        escaped_method,
        escaped_path,
        proxyLog->getStatusCode(),
        escaped_request_headers,
        escaped_response_headers,
        escaped_request_body,
        escaped_response_body
    );

    std::cout << "SQL: " << sql << "\n";

    PGresult *res = PQexec(conn, sql);

    if (PQresultStatus(res) != PGRES_TUPLES_OK) {
        PQclear(res);
        throw std::runtime_error("Failed to execute SQL query.");
    }

    std::cout << "SQL executed successfully.\n";

    char *proxy_log_id = PQgetvalue(res, 0, 0);
    char *timestamp_str = PQgetvalue(res, 0, 1);

    struct tm tm = {};
    if (strptime(timestamp_str, "%Y-%m-%d %H:%M:%S", &tm) == nullptr) {
        PQclear(res);
        throw std::runtime_error("Failed to parse timestamp.");
    }
    time_t timestamp = mktime(&tm);

    proxyLog->setProxyLogId(atoi(proxy_log_id));
    proxyLog->setTimestamp(timestamp);

    PQclear(res);
}