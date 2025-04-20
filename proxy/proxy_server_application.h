#include <Poco/Util/ServerApplication.h>

using namespace Poco::Util;

class ProxyServerApp : public ServerApplication
{
protected:
    int main(const std::vector<std::string> &args) override;
};