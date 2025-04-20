#include <Poco/Net/HTTPServerRequest.h>

#include "proxy_request_handler.h"
#include "proxy_request_handler_factory.h"
#include "web_socket_request_handler.h"

using namespace Poco::Net;

HTTPRequestHandler *ProxyRequestHandlerFactory::createRequestHandler(const HTTPServerRequest &request)
{
    if (request.getURI() == "/ws")
    {
        return new WebSocketRequestHandler;
    }

    return new ProxyRequestHandler;
}
