#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <Wire.h>
#include "RTClib.h"

// WiFi credentials
const char* ssid = "Ahmed iPhone (2)";
const char* password = "1234567890";

// API endpoint
const char* serverName = "http://172.20.10.2:5000/api/sensors";

// Pins
#define DHTPIN 15
#define DHTTYPE DHT11
#define SOIL_MOISTURE_PIN 4
#define LDR_PIN 34
#define WATER_LEVEL_PIN 35
#define SDA_PIN 21
#define SCL_PIN 22

DHT dht(DHTPIN, DHTTYPE);
RTC_DS3231 rtc;

void setup() {
  Serial.begin(115200);
  
  dht.begin();
  Wire.begin(SDA_PIN, SCL_PIN);

  if (!rtc.begin()) {
    Serial.println("Couldn't find RTC");
    while (1);
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");
}

void loop() {
   DateTime now = rtc.now();
  now = now + TimeSpan(0, 3, 0, 0);  // ⏱️ أضف 3 ساعات

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int soilMoisture = analogRead(SOIL_MOISTURE_PIN);
    int light = analogRead(LDR_PIN);
    int waterLevel = analogRead(WATER_LEVEL_PIN);

    DateTime now = rtc.now();
    String timestamp = String(now.timestamp());

    String jsonData = "{\"temperature\":" + String(temperature, 1) +
                      ",\"humidity\":" + String(humidity, 1) +
                      ",\"light\":" + String(light) +
                      ",\"soilMoisture\":" + String(soilMoisture) +
                      ",\"waterLevel\":" + String(waterLevel) +
                      ",\"timestamp\":\"" + timestamp + "\"}";

    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("✅ Response: " + response);
    } else {
      Serial.print("❌ Error Code: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }

  delay(10000); // send every 10 seconds
}
