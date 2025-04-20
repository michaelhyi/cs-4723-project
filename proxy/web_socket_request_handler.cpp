#include <iostream>

#include <Poco/Net/WebSocket.h>

#include "web_socket_manager.h"
#include "web_socket_request_handler.h"

using namespace Poco::Net;


void WebSocketRequestHandler::handleRequest(HTTPServerRequest &request, HTTPServerResponse &response)
{
    try
    {
        WebSocket *ws = new WebSocket(request, response);
        {
            WebSocketManager::getInstance().addClient(ws);
        }
        std::cout << "New WebSocket connection established." << std::endl;

        char buffer[1024];
        int flags;
        int n;

        while ((n = ws->receiveFrame(buffer, sizeof(buffer), flags)) > 0)
        {
            std::string receivedMessage(buffer, n);
            std::cout << "Received WebSocket message: " << receivedMessage << std::endl;
        }
    }
    catch (Poco::Exception &e)
    {
        std::cerr << "WebSocket error: " << e.displayText() << std::endl;
    }
}
