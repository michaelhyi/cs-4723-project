#include <iostream>
#include "proxy_server_application.h"
#include "proxy_log_dao.h"

int main(int argc, char **argv)
{
    if(ProxyLogDao::setConnnection()) {
        std::cerr << "Failed to connect to database" << std::endl;
        return 1;
    }

    return ProxyServerApp().run(argc, argv);
}
