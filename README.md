# APIVeil

Currently APIVeil consists of two servers:

* **Proxy Server (proxy.cpp)**: Listens on port 3000 for incoming HTTP requests. Sends the request body to the OpenAI API (GPT-3.5-turbo) for processing. Wraps the processed text in JSON and sends it to a base API (here, a simple echo server). Returns the base API’s response back to the original client.
* **Echo Server (echo_server.cpp)**: Listens on port 4000. Receives HTTP POST requests. Echoes back the received JSON payload.

## Prerequisites

### A. Install POCO

#### macOS

1.  Install Homebrew (if not already installed):

    ```bash
    /bin/bash -c "$(curl -fsSL [https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh](https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh))"
    ```

2.  Install POCO:

    ```bash
    brew install poco
    ```

#### Windows

1.  Install vcpkg (Microsoft’s C++ package manager):

    ```bash
    git clone [https://github.com/microsoft/vcpkg.git](https://github.com/microsoft/vcpkg.git)
    cd vcpkg
    .\bootstrap-vcpkg.bat
    ```

2.  Install POCO:

    ```bash
    .\vcpkg install poco
    ```

    * Make sure you have a C++ compiler (e.g., MinGW or Visual Studio) properly installed.

## B. Set Up Your OpenAI API Key

**macOS (Bash or Zsh):**

```bash
export OPENAI_API_KEY=YOUR_OPENAI_API_KEY
```
**Windows:**

```$env:OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
Replace YOUR_OPENAI_API_KEY with your actual key from OpenAI’s platform.
```
## Build and Run

### A. Compile & Run the Echo Server

The echo server listens on port 4000 and returns (echoes) any JSON payload you send.

**macOS (Apple Silicon example):**

```bash
g++ -std=c++17 -I/opt/homebrew/include -L/opt/homebrew/lib echo_server.cpp -lPocoNet -lPocoUtil -lPocoFoundation -pthread -o echo_server
./echo_server
```
* (If on Intel macOS, replace /opt/homebrew with /usr/local)
* You should see: Echo server listening on port 4000

## Windows (PowerShell, using vcpkg) - Proxy Server

**Compile and Run:**

```powershell
g++ -std=c++17 -IC:\vcpkg\installed\x64-windows\include -LC:\vcpkg\installed\x64-windows\lib proxy.cpp -lPocoNet -lPocoUtil -lPocoFoundation -lPocoNetSSL -lPocoCrypto -lPocoJSON -pthread -o proxy.exe
.\proxy.exe
```
* You should see: Proxy server listening on port 3000

## Echo and Proxy Server Testing

### A. Test the Echo Server Directly

1. Open a new terminal window.
2. Run the following `curl` command:

   ```sh
   curl -X POST -d '{"test": "hello"}' http://127.0.0.1:4000/echo
   ```

3. Expected response (the server echoes back the JSON body you sent):

   ```json
   {"test": "hello"}
   ```

### B. Test the Proxy Server

1. Send a POST request to the proxy on port 3000:

   ```sh
   curl -X POST -d "What is the capital of France?" http://127.0.0.1:3000/test
   ```

2. Expected flow:
   - The proxy receives the request and forwards "What is the capital of France?" to the OpenAI GPT-3.5-turbo endpoint.
   - The OpenAI API responds with an answer like:
     
     ```
     The capital of France is Paris.
     ```
   - The proxy wraps the response in a JSON object:
     
     ```json
     {"processed": "The capital of France is Paris."}
     ```
   - The proxy forwards this JSON object to the echo server on port 4000.
   - The echo server responds with the same JSON object.
   - The proxy returns the echoed JSON back to the `curl` request.

3. Expected output:

   ```json
   {"processed": "The capital of France is Paris."}
   ```

## How to set up RAG and populate chunks:
1. Go to api/open_ai/rag
2. Run 'pip install -r requirements.txt' onto your virtual environment
3. Run 'streamlit run app.py'
4. This will spin up a frontend for you to populate chunks with documentation and other static context


### Notes
- Ensure both the Echo Server (on port `4000`) and the Proxy Server (on port `3000`) are running before executing these commands.
- The proxy server must be correctly configured to interact with the OpenAI API and the Echo Server.
- Use `curl -v` to see detailed request and response headers for debugging if necessary.

