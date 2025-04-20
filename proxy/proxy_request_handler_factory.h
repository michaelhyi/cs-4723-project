#include <Poco/Net/HTTPRequestHandlerFactory.h>

using namespace Poco::Net;

class ProxyRequestHandlerFactory : public HTTPRequestHandlerFactory
{
public:
    HTTPRequestHandler *createRequestHandler(const HTTPServerRequest &request) override;
};