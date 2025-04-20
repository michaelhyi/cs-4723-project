#include <Poco/Net/HTTPRequestHandler.h>

#include "web_socket_manager.h"

using namespace Poco::Net;

class ProxyRequestHandler : public HTTPRequestHandler
{
public:
    void handleRequest(HTTPServerRequest &request, HTTPServerResponse &response) override;
};