# npm-license

Dieses Modul liest unterhalb eines gegebenen Verzeichnisses alle package.json Dateien, um aus den dort enthaltenen Informationen zur Lizenz eine Übersicht über die verwendeten Module und deren Lizenzen zu erstellen.

Die Ausgabe erfolgt als Liste der Module, gruppiert nach ihrer jeweiligen Lizenz.

Da rekursiv durch alle Unterverzeichnisse gesucht wird, werden für die Module auch alle transitiven Abhängigkeiten berücksichtigt.

## Installation:

```
git clone https://github.com/h9h/npm-license.git
cd npm-license
npm install
```
## Verwendung

```
npm start -- ABSOLUTES_VERZEICHNIS
```

Das Ergebnis ist dann auf der Konsole eine Ausgabe der Form:

```
\
===============================================================================
License: "(MIT AND CC-BY-3.0)"
-------------------------------------------------------------------------------
spdx-expression-parse (1.0.4)            [node_modules/spdx-expression-parse/package.json]



===============================================================================
License: "Unlicense"
-------------------------------------------------------------------------------
spdx-license-ids (1.2.2)                 [node_modules/spdx-license-ids/package.json]
tweetnacl (0.14.5)                       [node_modules/fsevents/node_modules/tweetnacl/package.json]
tweetnacl (0.14.5)                       [node_modules/tweetnacl/package.json]


```

Dass Module mehrfach aufgeführt werden, sogar in der gleichen Version, kommt dann vor,
wenn sie Dependencies mehrerer anderer Module sind.
Daher wird auch der jeweilige Pfad zur Herkunft angegeben.
Hier sieht man z.B. an ```[node_modules/fsevents/node_modules/tweetnacl/package.json]```, dass fsevents
selber eine Abhängigkeit zu ```tweetnacl``` in der Version 0.14.5 hat.
