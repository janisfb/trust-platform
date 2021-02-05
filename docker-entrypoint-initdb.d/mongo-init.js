print(
  "Start init #################################################################"
);

db = db.getSiblingDB("first_db");
db.services.drop();
db.createCollection("services");

db.services.save({
  _id: "601d5bb69421a5ebb7a3c877",
  company: "Weather Company",
  url: "example.com",
  email: "info@example.com",
  tel: "0123 4567890",
  name: "OpenWeather Dortmund",
  version: "1.0.0",
  description:
    "Dieser Dienst gibt das aktuelle Wetter am Standort Dortmund zurück.",
  needsFullAccess: false,
  accessReason: "Not Applicable",
  usesExternalService: true,
  externalServiceName: "Open Weather Map, rapidapi",
  externalServiceReason:
    "Die Wetterdaten werden extern von OpenWeather gesammelt und von diesem Service nur abgefragt.",
});

db.services.save({
  _id: "601d5bb69421a5ebb7a3c878",
  company: "Translation Company",
  url: "example.com",
  email: "info@example.com",
  tel: "0123 4567890",
  name: "Google Translate",
  version: "1.0.0",
  description:
    "Dieser Dienst übersetzt englischen Text.",
  needsFullAccess: true,
  accessReason: "Um den kompletten Text zu übersetzen, wird Vollzugriff benötigt.",
  usesExternalService: true,
  externalServiceName: "Google Translate, rapidapi",
  externalServiceReason:
    "Die Übersetzung erfolgt über den Google Translate Dienst und kann ressourcenbedingt nicht von der Translation Company durchgeführt werden.",
});

print(
  "End init #################################################################"
);