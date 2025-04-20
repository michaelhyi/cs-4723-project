#include <string>
#include <Poco/Net/HTTPServerResponse.h>

std::string getProcessedText(std::string incoming_body, Poco::Net::HTTPServerResponse& response);
