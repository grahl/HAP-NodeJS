#include "DHT.h"

#define DHTPIN D4     // what pin we're connected to

// Uncomment whatever type you're using!
//#define DHTTYPE DHT11   // DHT 11
#define DHTTYPE DHT22   // DHT 22  (AM2302)
//#define DHTTYPE DHT21   // DHT 21 (AM2301)
DHT dht(DHTPIN, DHTTYPE);


#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* WIFI_SSID =	"YOUR_SSID";		
const char* WIFI_PWD =	"YOUR_PW";		

const int UPDATE_INTERVAL_SECS = 60 * 10; // Update every 10 minutes


IPAddress server(10, 0, 1, 1);
WiFiClient wclient;
PubSubClient client(wclient, server);

void HomeKit() {
    if (WiFi.status() == WL_CONNECTED) {
    if (!client.connected()) {
      if (client.connect("TempHumiditySensor")) {
        client.publish("HomeKit","Temperature Sensor Online!");
        client.publish("HomeKit","Humidity Sensor Online!");
      }
    }

    if (client.connected()){
      Serial.println("publishing " +  String(dht.readTemperature()) + "°");
        client.publish("RoomATemperature",String(dht.readTemperature()));   
        Serial.println("publishing " +  String(dht.readHumidity()) + "%");
        client.publish("RoomAHumidity",String(dht.readHumidity()));   
        client.loop();
    }
      
  } else {
    Serial.println("No wifi");
    }
}

void setup() {
  // Setup console
  Serial.begin(115200);
  delay(10);
  dht.begin();
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PWD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}


void loop() {
 HomeKit();
 Serial.println("Sending completed");
 delay(UPDATE_INTERVAL_SECS * 1000);
}
