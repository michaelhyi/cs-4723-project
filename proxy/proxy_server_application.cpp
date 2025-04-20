#include <iostream>

#include <Poco/Net/HTTPServer.h>
#include <Poco/Net/HTTPServerParams.h>
#include <Poco/Net/ServerSocket.h>
#include <Poco/Net/SSLManager.h>

#include "proxy_server_application.h"
#include "proxy_request_handler_factory.h"

using namespace Poco::Net;

const std::string PORT = std::getenv("PORT") ? std::getenv("PORT") : "4000";

int ProxyServerApp::main(const std::vector<std::string> &args)
{
    Poco::Net::initializeSSL();
    ServerSocket svs(std::stoi(PORT));
    HTTPServer server(new ProxyRequestHandlerFactory, svs, new HTTPServerParams);
    server.start();
    std::cout << "Proxy server listening on port " << PORT << std::endl;

    waitForTerminationRequest();
    server.stop();
    Poco::Net::uninitializeSSL();
    return Application::EXIT_OK;
}