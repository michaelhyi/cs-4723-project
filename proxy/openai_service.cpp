#include <iostream>
#include <string>
#include <Poco/JSON/Array.h>
#include <Poco/JSON/Object.h>
#include <Poco/JSON/Parser.h>
#include <Poco/Net/HTTPRequest.h>
#include <Poco/Net/HTTPResponse.h>
#include <Poco/Net/HTTPSClientSession.h>
#include "openai_service.h"

using namespace Poco::Net;

const std::string OPENAI_API_HOST = "api.openai.com";
const int OPENAI_API_PORT = 443;
const std::string OPENAI_API_PATH = "/v1/chat/completions";

std::string getProcessedText(std::string incoming_body, HTTPServerResponse &response)
{
    std::string processedText;
    // we build a json payload for openai api. we will prolly swap this out later
    std::stringstream jsonStream;
    jsonStream << "{";
    jsonStream << "\"model\": \"gpt-3.5-turbo\",";
    jsonStream << "\"messages\": [ { \"role\": \"user\", \"content\": \"Process this request: " << incoming_body << "\" } ],";
    jsonStream << "\"max_tokens\": 50";
    jsonStream << "}";
    std::string jsonPayload = jsonStream.str();

    Poco::Net::Context::Ptr context = new Poco::Net::Context(Poco::Net::Context::CLIENT_USE, "", "", "", Poco::Net::Context::VERIFY_NONE);
    HTTPSClientSession httpsSession(OPENAI_API_HOST, OPENAI_API_PORT, context);

    HTTPRequest openaiRequest(HTTPRequest::HTTP_POST, OPENAI_API_PATH, HTTPMessage::HTTP_1_1);
    openaiRequest.setContentType("application/json");

    // TODO: inject OPENAI_API_KEY
    const char *openai_api_key = std::getenv("OPENAI_API_KEY");
    if (openai_api_key)
    {
        openaiRequest.set("Authorization", std::string("Bearer ") + openai_api_key);
    }
    else
    {
        response.setStatus(HTTPResponse::HTTP_INTERNAL_SERVER_ERROR);
        response.send() << "Error: OPENAI_API_KEY environment variable not set.";
        return "";
    }
    openaiRequest.setContentLength(jsonPayload.length());

    std::ostream &os = httpsSession.sendRequest(openaiRequest);
    os << jsonPayload;

    HTTPResponse openaiResponse;
    std::istream &is = httpsSession.receiveResponse(openaiResponse);
    std::stringstream responseStream;
    Poco::StreamCopier::copyStream(is, responseStream);
    std::string openaiResponseBody = responseStream.str();
    std::cout << "OpenAI API response: " << openaiResponseBody << std::endl;

    Poco::JSON::Parser parser;
    Poco::Dynamic::Var result = parser.parse(openaiResponseBody);
    Poco::JSON::Object::Ptr jsonObject = result.extract<Poco::JSON::Object::Ptr>();
    auto choicesVar = jsonObject->get("choices");
    Poco::JSON::Array::Ptr choicesArray = choicesVar.extract<Poco::JSON::Array::Ptr>();
    if (!choicesArray->empty())
    {
        Poco::JSON::Object::Ptr firstChoice = choicesArray->getObject(0);
        Poco::JSON::Object::Ptr messageObj = firstChoice->getObject("message");
        processedText = messageObj->getValue<std::string>("content");
    }
    else
    {
        processedText = "No result from OpenAI API.";
    }

    return processedText;
}