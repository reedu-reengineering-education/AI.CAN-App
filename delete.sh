#!/bin/bash

# Verzeichnis, in dem die Suche gestartet werden soll
start_dir="./"

# Funktion zum Löschen von Dateien mit dem Namen Zone.Identifier
delete_zone_identifier_files() {
    find "$1" -type f -name 'Zone.Identifier' -exec rm -f {} \;
}

# Skript ausführen
delete_zone_identifier_files "$start_dir"

echo "Alle Dateien mit dem Namen 'Zone.Identifier' wurden gelöscht."
