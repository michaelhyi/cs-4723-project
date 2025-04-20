#include <iostream>

#include "web_socket_manager.h"

WebSocketManager::WebSocketManager()
{
}

WebSocketManager &WebSocketManager::getInstance()
{
    static WebSocketManager instance;
    return instance;
}

void WebSocketManager::addClient(WebSocket *ws)
{
    std::lock_guard<std::mutex> lock(clientsMutex);
    clients.push_back(ws);
}

void WebSocketManager::broadcastMessage(const std::string &message)
{
    std::lock_guard<std::mutex> lock(clientsMutex);
    for (auto it = clients.begin(); it != clients.end();)
    {
        try
        {
            (*it)->sendFrame(message.data(), message.size(), WebSocket::FRAME_TEXT);
            ++it;
        }
        catch (Poco::Exception &e)
        {
            std::cerr << "WebSocket send error: " << e.displayText() << std::endl;
            delete *it; // Clean up closed sockets
            it = clients.erase(it);
        }
    }
}