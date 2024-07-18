/*
 * file DFRobot_EC.ino
 * @ https://github.com/DFRobot/DFRobot_EC
 *
 * This is the sample code for Gravity: Analog Electrical Conductivity Sensor / Meter Kit V2 (K=1.0), SKU: DFR0300.
 * In order to guarantee precision, a temperature sensor such as DS18B20 is needed, to execute automatic temperature compensation.
 * You can send commands in the serial monitor to execute the calibration.
 * Serial Commands:
 *   enterec -> enter the calibration mode
 *   calec -> calibrate with the standard buffer solution, two buffer solutions(1413us/cm and 12.88ms/cm) will be automaticlly recognized
 *   exitec -> save the calibrated parameters and exit from calibration mode
 *
 * Copyright   [DFRobot](http://www.dfrobot.com), 2018
 * Copyright   GNU Lesser General Public License
 *
 * version  V1.0
 * date  2018-03-21
 */

#include "DFRobot_EC.h"
#include "DFRobot_PH.h"
#include <senseBoxIO.h>
#include <OneWire.h> // http://librarymanager/All#OneWire
#include <DallasTemperature.h> // http://librarymanager/All#DallasTemperature
#include <SenseBoxBLE.h>
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h> // http://librarymanager/All#Adafruit_GFX_Library
#include <Adafruit_SSD1306.h> // http://librarymanager/All#Adafruit_SSD1306


#define PH_PIN 5
#define EC_PIN 3
#define ONE_WIRE_BUS 1
int period = 1000;
unsigned long time_now = 0;
bool recording = false;
long last;
long time_start = 0;

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const long displayInterval = 2000;  // Intervall auf 2000 ms gesetzt (2 Sekunden)
long displayIntervalActual;  // Intervall auf 2000 ms gesetzt (2 Sekunden)

DFRobot_EC ec;
DFRobot_PH ph;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
String name;
float voltage,voltagePh,ecValue,phValue,temperature = 25;

int temperatureCharacteristic = 0;
int phCharacteristic = 0;
int ecCharacteristic = 0;
int turbidityCharacteristic = 0;

float getWaterTemp(){
  sensors.requestTemperatures();
  sensors.getTempCByIndex(0);

}

// starts bluetooth and sets the name according to the Bluetooth Bee
// TODO: can the ID be seen on the hardware? 
void startBluetooth() {
  SenseBoxBLE::start("senseBox-BLE");
  delay(1000);
  name = "senseBox:bike [" + SenseBoxBLE::getMCUId() + "]";
  SenseBoxBLE::setName(name);
  Serial.println(name);
  delay(1000);
  Serial.print("Adding BLE characteristics...");
  SenseBoxBLE::addService("CF06A218F68EE0BEAD048EBC1EB0BC84");
  temperatureCharacteristic = SenseBoxBLE::addCharacteristic("2CDF217435BEFDC44CA26FD173F8B3A8");
  phCharacteristic = SenseBoxBLE::addCharacteristic("772DF7EC8CDC4EA986AF410ABE0BA257");
  ecCharacteristic = SenseBoxBLE::addCharacteristic("7E14E07084EA489FB45AE1317364B979");
  turbidityCharacteristic = SenseBoxBLE::addCharacteristic("B944AF10F4954560968F2F0D18CAB522");
  
  Serial.println("done!");
}

// sends phenomenas to the given BT characteristics
void writeToBluetooth() {
  bool connected = SenseBoxBLE::write(temperatureCharacteristic, temperature);
  SenseBoxBLE::write(phCharacteristic, phValue);
  SenseBoxBLE::write(ecCharacteristic, ecValue);
}

// set measurements for acceleration, distance, humidity and temperature
void setMeasurements() {


  voltage = analogRead(EC_PIN)/1024.0*3300;   // read the voltage
  voltagePh = analogRead(PH_PIN)/1024.0*3300;  // read the voltage
  temperature = getWaterTemp();          // read your temperature sensor to execute temperature compensation
  ecValue =  ec.readEC(voltage,temperature);  // convert voltage to EC with temperature compensation
  phValue = ph.readPH(voltagePh,temperature);  // convert voltage to pH with temperature compensation

}

void setup()
{
  Serial.begin(115200);  
  startBluetooth();
  ec.begin();
  ph.begin();
  sensors.begin();
display.begin(SSD1306_SWITCHCAPVCC, 0x3D);
display.display();
delay(100);
display.clearDisplay();
}

void loop()
{   
    SenseBoxBLE::poll();
    time_start = millis();
    setMeasurements();
writeToBluetooth();

    time_now = millis();
    while (millis() < time_start + period) {
      SenseBoxBLE::poll();
      delay(5);
    }
  
      display.clearDisplay();
      display.setCursor(0, 0);
      display.setTextSize(1);
      display.setTextColor(WHITE, BLACK);
        display.print("Wassertemp:");
        display.println(temperature);
        display.println();
        display.print("EC: "); 
        display.println(ecValue, 2);
        display.println();
        display.print("pH: "); 
        display.println(phValue);
              display.display();


}


