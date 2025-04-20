#ifndef NETWORK_LOG_DAO_H
#define NETWORK_LOG_DAO_H

#include <libpq-fe.h>
#include "proxy_log.h"

class ProxyLogDao {
private:
    static PGconn *conn;

public:
    static int setConnnection();
    static void createProxyLog(ProxyLog *proxy_log);
};

#endif