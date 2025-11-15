Erstelle die Verfassung und stütze dich dabei auf die @AGENTS.md. 

Halte in der Verfassung auch nach, dass mit Abschlusss der Implementierung einer neuen Spezifikation immer die @AGENTS.md und die @README.md auf nötig gewordene Aktualisierungen zu prüfen und diese vorzunehmen. Sollten weitere Dokumentationen nötig sein die nur die aktuell in Arbeit befindliche Spezifikation betreffen so sind diese unterhalb des Verzeichnisses docs/ nachzuhalten. 

Bei der Benennung neuer Branches und Specs ist darauf zu achten, dass die vorangestellte laufende Nummer eindeutig und fortlaufend ist. Hierfür ist jedesmal "git branch" zu befragen. Es darf bspw. nicht vorkommen, dass zwei unterschiedliche Spezifikationen beide mit "002" anfangen nur weil man gerade in "001" zugange war und ein eigentlich bereits vorhandener branch der mit "002" beginnt für die Zählung ignoriert wurde weil er noch nicht gemerged war.  

Branch-Strategien und Pull-Requests müssen den Zusammenhang zu Spezifikation und Dokumentation erhalten.

Wann immer ein einzelner Task aus der Taskliste implementiert wurde, und Tests darauf erfolgreich waren, soll im jeweils aktuellen Feature Branch automatisch ein "git add ." gefolgt von "git commit -m" mit einer aussagekräftigen Darstellung der Änderungen erfolgen. Wann immer es nötig wird, neue Module in die package.json aufzunehmen ist darauf zu achten, dass keine Module, auch nicht als Abhängigkeiten, hinzugezogen werden die bereits als deprecated markiert wurden.