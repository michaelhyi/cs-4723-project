#include <vector>
#include <string>
#include <mutex>

#include <Poco/Net/WebSocket.h>

using namespace Poco::Net;

#ifndef WEB_SOCKET_MANAGER_H
#define WEB_SOCKET_MANAGER_H

class WebSocketManager {
private:
    std::vector<WebSocket *> clients;
    std::mutex clientsMutex;

    WebSocketManager();
    WebSocketManager(WebSocketManager &other) = delete;
    void operator=(const WebSocketManager &) = delete;

public:
    static WebSocketManager &getInstance();
    void addClient(WebSocket *ws);
    void broadcastMessage(const std::string &message);
};
#endif