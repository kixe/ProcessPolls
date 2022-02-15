ProcessPolls
============

Umfrage und Wahltool für das CMS ProcessWire

## 1. Übersicht

Umfragen oder Wahlen können im Front- oder Backend durchgeführt werden. Für die Umfrage oder Wahl können alle im Backend verfügbaren Templates und Felder genutzt werden. Jede einzelne Meinungs- oder Stimmabgabe wird als ProcessWire Page gespeichert.

Es können beliebig viele Umfragen oder Wahlen parallel ablaufen. Für jede Wahl muß ein Zeitfenster (Datum) bestimmt werden. Nur in diesem Zeitfenster ist die Wahl möglich.

Umfragen über das Frontend sind grundsätzlich anonym, da hier keine Authentifizierung vorgesehen ist, der Datensatz wird immer als Gastnutzer (ID=40) gespeichert. Umfragen über das Backend können entweder anonym oder nicht anonym sein. Im letzteren Fall ist die jeweilige Meinung oder Stimme auch im Nachhinein dem ProcessWire Nutzer zuordenbar, der diese abgegeben hat.

Umfragen können Token-basiert sein. Dies garantiert eine nur einmalige Meinungs- oder Stimmabgabe. Auch hier sind anonyme Umfragen oder Wahlen möglich.

Bei Token-basierten Umfragen oder Wahlen wird die Registrierung der Meinungs- oder Stimmabgabe unabhängig von der Meinung oder Stimme selbst gespeichert. Nach erfolgter Stimmabgabe wird dem Nutzer ==einmalig== ein Bestätigungscode (PVC = Poll Verification Code) eingeblendet. Dieser Bestätigungscode wird weder in der Datenbank noch in einem Logfile gespeichert. Ermöglicht es aber dem Nutzer seine Meinung oder Stimme bei der Auswertung zu identifizieren. Dazu muß der Code in dem Moment kopiert oder durch einen Screenshot gesichert werden, wenn er nach der Wahl eingeblendet wird. Ein erneutes Aufrufen des Bestätigungscodes ist unmöglich.

Ohne den Bestätigungscode (PVC), den jeweils nur der einzelne Nutzer kennt, ist eine nachträgliche Zuordnung von Nutzer zu Meinung oder Stimme weder durch den Nutzer selbst, einen anderen Nutzer, noch durch einen Systemadministrator möglich.

## 2. Teilnahmebedingungen

Bei der Konfiguration der Umfrage oder Wahl kann eine Seite mit Teilnahmebedingungen spezifiziert werden. Findet die Wahl im ProcessWire Backend statt, so muß jeder Teilnehmer diese Bedingungen bestätigen um teilnehmen zu können. Die Bestätigung wird auf dem genutzten Gerät durch ein Cookie, dessen Wert ein Datumsstempel ist, gespeichert. Dieses Cookie ist nur für eine spezifische Wahl und den aktuell eingeloggten Nutzer gültig.

## 3. Sicherheit

### 3.1. Berechtigung zur Teilnahme

Die grundsätzliche Nutzung des Tools bzw. der Zugang wird durch die Berechtigung 'poll-view' geregelt, die einer oder mehreren Rollen zugeordnet sein kann. Dies muß nach der Installation des Moduls manuell für jede Rolle erledigt werden.

Die Berechtigung zur Teilnahme an einer spezifischen Umfrage oder Wahl wird in der Konfiguration mittels eines ProcessWire-Selectors bezogen auf den Nutzer geregelt. Entspricht der Nutzer nicht diesem Selector, so ist eine Teilnahme nicht möglich. Die entsprechende Umfrage wird für diesen Nutzer weder gelistet, noch ist für ihn die Umfrage Plattform erreichbar.

Beim Einrichten des Selectors, lässt sich überprüfen, welcher Nutzer diesem Selector entspricht.

### 3.2. Berechtigung zum Anlegen, Editieren von Umfragen und Wahlen

Neben dem Superuser (ID=41) sind alle Nutzer, mit Rollen, denen die Berechtigung 'poll-admin' zugeordnet ist berechtigt Umfragen und Wahlen anzulegen, zu editieren und zu löschen.

### 3.3. Wahlbeobachter

Bei der Installation des Moduls wird die Berechtigung 'poll-monitor' angelegt. Alle Nutzer mit Rollen, denen diese Berechtigung zugeordnet ist, haben Einblick in die Administrationsoberfläche, können diese aber nicht editieren. Zusätzlich wird in der Listenansicht die Anzahl der abgegebenen Meinungen oder Stimmen angezeigt.

### 3.4. Token

Die vom Systemgenerierten Token sind standardmäßig eine 6-stellige alphanumerische Zeichenfolge. Daraus ergeben sich ca. 57 Milliarden Möglichkeiten. Die Konstante TOKEN_LENGTH kann bei Bedarf angepasst werden.

```
/**
 * TOKEN_LENGTH alphanumeric (0-9, a-z, A-Z)
 * 
 * number of possible strings depending on length
 * length 5: ≈       916.000.000 options
 * length 6: ≈    56.800.000.000 options
 * length 7: ≈ 3.520.000.000.000 options
 *
 */
 const TOKEN_LENGTH = 6;
```

#### 3.4.1. Tokenliste
Eine Liste mit einer bestimmten Anzahl von gültigen Token zu einer spezifischen Umfrage oder Wahl, kann im Administrationsbereich erzeugt werden. Dies ist nützlich bei Frontendaktionen, wenn z.B. Token vorher an den Kreis der Berechtigten per E-Mail versendet werden sollen. Ein Automatismus zum Versand von solchen E-Mails ist nicht implementiert.

#### 3.4.2. auto-generierte Token

Bei Umfragen oder Wahlen im ProcessWire-Backend wird, nachdem die Berechtigung zur Teilnahme überprüft wurde, schon beim Aufruf der Wahlliste ein Token erzeugt und fest mit diesem Nutzer verknüpft. Klickt der Nutzer dann auf den Link zur Stimmabgabe, wird das Token per GET-Parameter übergeben und ermöglicht so die Wahl. Sobald das Token erzeugt wurde, ist es für diesen Nutzer nicht mehr möglich ein anderes Token für die zugeordnete Wahl zu nutzen.

### 3.5. Fehleingaben und Manipulationsversuche

#### 3.5.1. eingeloggte Nutzer
Der Versuch einer Mehrfachteilnahme, die Nutzung eines ungültig gewordenen Links mit Token, eine Fehleingabe oder Manipulationsversuche sind nach der Zuordnung eines Tokens zum eingeloggten Nutzer faktisch ausgeschlossen.

#### 3.5.2. Übertragung
Die Übertragung eines validen Tokens von einem Nutzer zum anderen ist unmöglich. Das valide aber fremdzugeordnete Token wird bei Nutzung durch einen anderen eingeloggten Nutzer sofort 
gelöscht und ist danach auch für den berechtigten Nutzer nicht mehr nutzbar.

#### 3.5.3 nicht nutzerspezifische Token
Bei nicht zugeordneten Token (vorab generierte Tokenlisten) werden Fehleingabe oder Manipulationsversuche vom System registriert. Die maximale Anzahl von erlaubten Fehlversuchen pro IP-Adresse und Tag (z.B. Fehler beim Kopieren des Tokens) ist durch die Konstante MAX_INVALID_ATTEMPTS festgelegt und kann auf Wunsch geändert werden. 

```
/**
 * max number of attempts with invalid tokens by IP per day
 * 
 */
 const MAX_INVALID_ATTEMPTS = 8;
```

#### 3.5.4. Sperrung und Log
Nach der erlaubten Anzahl von Manipulationsversuchen ist die Wahloberfläche nicht mehr erreichbar. Manipulationsversuche werden mit IP-Adresse und Zeitstempel geloggt.
Die Wahrscheinlichkeit mit 8 Versuchen ein Token zu erraten, kann man als faktisch unmöglich einstufen.

## 4. Ablauf der Umfrage oder Wahl

### 4.1. Frontend

... *todo* ...

### 4.2. Backend
Voraussetzung: Der Nutzer ist berechtigt an der Wahl oder Umfrage teilzunehmen (s.o.).
Nach dem erfolgreichen Login findet der Nutzer im Hauptmenü den Menüpunkt: 'Umfragen & Wahlen'. Über diesen Link erreicht er eine Liste von aktuellen Umfragen und Wahlen. Durch klick auf den Link zu einer speziellen Wahl wird die Umfrage- bzw. Wahloberfläche erreicht. Hier kann die Wahl erfolgen. Durch klicken des Buttons 'Abschicken' wird die Wahl abgeschlossen.

#### 4.2.1. nicht Token-basierte Umfrage oder Wahl
Handelt es sich nicht um eine Token-basierte Umfrage oder Wahl, kann der Nutzer innerhalb des festgelegten Zeitraums jederzeit hierher zurückkehren und eine erneute Stimmabgabe tätigen. Ist die Umfrage oder Wahl anonym so wird jedes Mal eine neue Stimmabgabe erzeugt. Bei einer nicht anonymen Umfrage oder Wahl, kann im vorgegebene Zeitraum, die Stimmabgabe geändert werden, in diesem Fall bleibt es somit bei einer einzelnen Stimmabgabe.

#### 4.2.2. Token-basierte Umfrage oder Wahl
Bei einer Token-basierten Umfrage oder Wahl ist pro Nutzer nur eine einzelne Stimmabgabe möglich. Die Stimmabgabe ist abgeschlossen, wenn der Nutzer den Button 'Abschicken' klickt und der Bestätigungscode (s.o.) eingeblendet wird. Im Falle einer Fehlermeldung, kann nach Korrektur der Einträge die ein erneuter Versuch der Stimmabgabe durch Klicken des Buttons 'Abschicken' erfolgen.


