/*
Device de teste para a interface desenvolvida
Gera um sinal harmônico na porta serial para teste da interface do curso
*/

/************************* Inclusão das Bibliotecas *********************************/
#include "ESP8266WiFi.h"
#include "Adafruit_MQTT.h"
#include "Adafruit_MQTT_Client.h"
#include <ArduinoJson.h>

/************************* Conexão WiFi*********************************/

#define WIFI_SSID       "Kriptonio_V70" // nome de sua rede wifi
#define WIFI_PASS       "995norte123"     // senha de sua rede wifi

/********************* Credenciais Adafruit io *************************/

#define AIO_SERVER      "io.adafruit.com"
#define AIO_SERVERPORT  1883
#define AIO_USERNAME    "mateustoin"                              // Seu usuario cadastrado na plataforma da Adafruit
#define AIO_KEY         "aio_qiOu94t14zYOfzo2WJNybiqH2vfp"        // Sua key da dashboard

/********************** Variaveis globais *******************************/

WiFiClient client;

Adafruit_MQTT_Client mqtt(&client, AIO_SERVER, AIO_SERVERPORT, AIO_USERNAME, AIO_KEY);

unsigned long lastMsg = 0;

const float F  = 0.2f;     // frequência da senoide
const float Fs = 50.f;    // taxa de amostragem

const float Ts = 1.f / Fs;  // período de amostragem

// define a amplitude de cada harmonico 
const uint8_t N_harmonics  = 5;
const float A[N_harmonics] = {1.f, 0.23f, 0.34f, 0.32f, 0.17f};

// amplitude do ruído
const float An             = 0.3f;

const uint32_t int_Ts = Ts * 1e6f;
uint32_t last_sample  = 0;
float t               = 0;

float gaussian_noise(const uint8_t samples);

/****************************** Declaração dos Feeds ***************************************/

Adafruit_MQTT_Publish emg_sensor = Adafruit_MQTT_Publish(&mqtt, AIO_USERNAME "/feeds/sensores", MQTT_QOS_1);

/*************************** Declaração dos Prototypes ************************************/

void initWiFi();
void conectar_broker();

void setup()
{
  Serial.begin(115200);
  initWiFi();
}

void loop()
{ 
  conectar_broker();
  mqtt.processPackets(3000);

  // controle do tempo de amostragem ---------------------------
  if (micros() - last_sample < int_Ts)
    return;
  
  last_sample = micros();

  // gera o sinal contendo a importância de cada harmonico -----
  float output = 0;
  for (uint8_t i = 0; i < N_harmonics; i++)
    output += A[i] * sin(2.f * M_PI * F * (i + 1) * t);

  output += An * gaussian_noise(8);

  // incrementa o tempo ----------------------------------------
  t += Ts;

  //Serial.println(output);

  String aux =  "{\"sensor\":\"eletromiografo (EMG)\",\"valor\": ";
  aux.concat(output);

  Serial.println(aux);
  
    if (! emg_sensor.publish(aux.c_str())) {
      Serial.println("Falha ao enviar o valor do sensor.");
    }
 
}

// retorna uma amostra do ruído gaussiano utilizando
// o teorema do limite central 
float gaussian_noise(const uint8_t samples)
{
  const float MAX = 1000;
  float sum       = 0;

  for (uint8_t i = 0; i < samples; i++)
    sum += (-MAX / 2.f + random(MAX)) / MAX;

  return sum / samples; 
}

/* Configuração da conexão WiFi */
void initWiFi() {
  Serial.print("Conectando-se na rede "); Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  Serial.println("Conectado à rede com sucesso"); Serial.println("Endereço IP: "); Serial.println(WiFi.localIP());
}

/* Conexão com o broker e também servirá para reestabelecer a conexão caso caia */
void conectar_broker() {
  int8_t ret;

  if (mqtt.connected()) {
    return;
  }

  Serial.println("Conectando-se ao broker mqtt...");

  uint8_t num_tentativas = 3;
  while ((ret = mqtt.connect()) != 0) {
    Serial.println(mqtt.connectErrorString(ret));
    Serial.println("Falha ao se conectar. Tentando se reconectar em 5 segundos.");
    mqtt.disconnect();
    delay(5000);
    num_tentativas--;
    if (num_tentativas == 0) {
      Serial.println("Seu ESP será resetado.");
      while (1);
    }
  }
}
