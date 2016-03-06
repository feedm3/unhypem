:: This script is a simple load test for the popular route.
@ECHO OFF
echo %time% Start load test of http://localhost:3000/popular
FOR /l %%x IN (1, 1, 1000) do (
    curl -sL -w "%%{url_effective}: %%{http_code}\n" "http://localhost:3000/popular" -o NUL
)
echo %time% Finished load test