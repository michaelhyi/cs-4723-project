#include <string>
#include <map>
#include <Poco/Net/HTTPServerRequest.h>

using namespace Poco::Net;

std::string getBody(HTTPServerRequest &request);
std::unordered_map<std::string, std::string> getHeaders(HTTPMessage &msg);