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
npm start --dir VERZEICHNIS
```

oder unter linux/osx auch einfach:
```
lic --dir VERZEICHNIS
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

Alternativ kann mit der Option '--csv' eine Liste im CSV-Format ausgegeben werden:

```
npm start --dir VERZEICHNIS --csv
```

mit einem Ergebnis der folgenden Form:

```
node_modules/read-pkg-up/package.json;MIT;read-pkg-up;2.0.0
node_modules/require-directory/package.json;MIT;require-directory;2.1.1
node_modules/require-main-filename/package.json;ISC;require-main-filename;1.0.1
node_modules/semver/package.json;ISC;semver;5.4.1
node_modules/set-blocking/package.json;ISC;set-blocking;2.0.0
node_modules/shebang-command/package.json;MIT;shebang-command;1.2.0
node_modules/shebang-regex/package.json;MIT;shebang-regex;1.0.0
node_modules/signal-exit/package.json;ISC;signal-exit;3.0.2
node_modules/spdx-correct/package.json;Apache-2.0;spdx-correct;1.0.2
```

Spalten: 

Fundstelle;Lizenz;Modul;Version

bzw. bei Fehlern:

Fundstelle;error;Fehlermeldung
