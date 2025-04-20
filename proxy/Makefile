# Default target
all: local

# Local macOS build with homebrew paths
local:
	g++ -std=c++17 *.cpp -I/opt/homebrew/include -L/opt/homebrew/lib -I/opt/homebrew/Cellar/postgresql@14/14.17_1/include/postgresql@14 -L/opt/homebrew/Cellar/postgresql@14/14.17_1/lib/postgresql@14 \
	-lPocoNet -lPocoFoundation -lPocoUtil -lPocoNetSSL -lPocoJSON -lpq \
	-o proxy_compiled

# Docker/Ubuntu build with system paths
docker:
	g++ -v -std=c++17 *.cpp \
	-I/usr/include/postgresql \
	-L/usr/lib \
	-lPocoNet -lPocoFoundation -lPocoUtil -lPocoNetSSL -lPocoJSON -lpq \
	-o proxy_compiled || true

# Alternative Ubuntu Docker target with lowercase naming
docker-alt:
	g++ -v -std=c++17 *.cpp \
	-I/usr/include/postgresql \
	-L/usr/lib \
	-lPocoNet -lPocoFoundation -lPocoUtil -lPocoNetSSL -lPocoJson -lpq \
	-o proxy_compiled || true

# Final fallback that uses pkg-config
docker-fallback:
	g++ -v -std=c++17 *.cpp \
	-I/usr/include/postgresql \
	`pkg-config --cflags --libs Poco` \
	-lpq \
	-o proxy_compiled

# Clean build artifacts
clean:
	rm -f proxy_compiled

.PHONY: all local docker docker-alt docker-fallback clean