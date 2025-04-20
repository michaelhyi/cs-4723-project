#include <sstream>
#include <Poco/StreamCopier.h>
#include "proxy_request_handler_util.h"

std::string getBody(HTTPServerRequest &request) {
    std::stringstream stream;
    Poco::StreamCopier::copyStream(request.stream(), stream);
    return stream.str();
}

std::unordered_map<std::string, std::string> getHeaders(HTTPMessage &msg) {
    std::unordered_map<std::string, std::string> headers;

    Poco::Net::NameValueCollection::ConstIterator it = msg.begin();
    Poco::Net::NameValueCollection::ConstIterator end = msg.end();
    for (; it != end; ++it) {
        headers.insert({it->first, it->second});
    }

    return headers;
}