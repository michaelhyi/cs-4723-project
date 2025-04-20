#include <Poco/Net/HTTPRequestHandler.h>

using namespace Poco::Net;

class WebSocketRequestHandler : public HTTPRequestHandler
{
public:
    void handleRequest(HTTPServerRequest &request, HTTPServerResponse &response) override;
};