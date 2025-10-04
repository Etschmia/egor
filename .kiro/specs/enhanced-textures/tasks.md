# Implementierungsplan: Enhanced Textures

- [x] 1. Zombie-Texturen verbessern
  - Implementiere detaillierte Zombie-Textur mit Gesichtszügen, Wunden, zerrissener Kleidung und erkennbaren Händen
  - Verwende mehrere Grüntöne (#2E8B57, #3CB371, #90EE90) mit Farbverläufen für die Haut
  - Füge leuchtende gelbe Augen mit radialen Gradienten hinzu
  - Erstelle sichtbare Zähne im Mund und Blutflecken auf der Kleidung
  - Zeichne erkennbare Finger (5 pro Hand) mit einzelnen Rechtecken
  - Verbessere die Leichnam-Textur mit realistischer liegender Position und Blutlache
  - _Anforderungen: 1.1, 1.2, 1.3_

- [x] 2. Monster-Texturen verbessern
  - Implementiere muskulöse Körperstruktur mit mehreren Rottönen (#8B0000, #FF4500, #DC143C)
  - Erstelle detaillierte 3D-Hörner mit Glanzeffekten (Gradienten von #C0C0C0 zu #696969)
  - Zeichne geöffnetes Maul mit 6-8 sichtbaren Reißzähnen
  - Füge detaillierte Klauen an Händen und Füßen hinzu (einzelne Krallen)
  - Implementiere leuchtende rot-gelbe Augen mit mehreren Schichten
  - Erstelle sichtbare Muskelstruktur durch Schattierungen
  - Verbessere die Leichnam-Textur mit zusammengesunkener Form
  - _Anforderungen: 2.1, 2.2_

- [x] 3. Geist-Texturen verbessern
  - Implementiere fließende, ätherische Körperform mit bezierCurveTo()
  - Erstelle mehrere Transparenzebenen (70-85% mit globalAlpha)
  - Füge hohle, leuchtende Augen mit Glanzpunkten hinzu
  - Implementiere wispy, nebelige Ränder mit Farbverläufen (Weiß zu Blau)
  - Erstelle innere Leuchteffekte mit radialen Gradienten
  - Zeichne gequälten Gesichtsausdruck mit gebogenem Mund
  - Verbessere die Leichnam-Textur mit verblassendem Effekt
  - _Anforderungen: 3.1, 3.2, 3.3_

- [x] 4. Hund-Texturen verbessern
  - Implementiere erkennbare Hundeform mit vier deutlichen Beinen
  - Erstelle Fellstruktur mit mehreren Brauntönen (#3A1A0A, #5A3A1A, #6B4A2A)
  - Zeichne detaillierte Schnauze mit gebleckten Zähnen (mindestens 4 Zähne)
  - Füge angelegte Ohren für aggressive Haltung hinzu
  - Implementiere leuchtend rote Augen (#FF0000) mit Glüheffekt
  - Erstelle erkennbare Pfoten mit einzelnen Krallen
  - Positioniere Hund in aggressiver Angriffsstellung
  - Verbessere die Leichnam-Textur mit liegendem Hund und Blutlache
  - _Anforderungen: 4.1, 4.2_


- [x] 5. Schatz-Textur verbessern
  - Implementiere erkennbare Kelchform mit bezierCurveTo() für organische Kurven
  - Erstelle goldenen Farbverlauf (#FFD700, #FFA500, #B8860B) für metallischen Effekt
  - Füge Edelsteine (rot oder blau) als Akzente hinzu
  - Implementiere Glanzlichter (#FFFFE0) für Highlights
  - Erstelle 3D-Effekt mit Schattierungen und dunklem Rand
  - Zeichne detaillierte Basis, Stiel und Oberteil des Kelchs
  - _Anforderungen: 5.1_

- [x] 6. Medi-Pack-Texturen verbessern
  - Implementiere 3D-Box-Effekt mit Schattierungen für beide Größen
  - Erstelle deutliches weißes Kreuz auf rotem Hintergrund
  - Füge visuellen Größenunterschied zwischen klein und groß hinzu (dickere Balken, Rand)
  - Implementiere weiße Highlights für Plastik-Glanz-Effekt
  - Erstelle dunklen Rand für bessere Definition
  - Verwende verschiedene Rottöne (#FF0000, #CC0000, #FF4444) für Tiefe
  - _Anforderungen: 5.2_

- [x] 7. Munitions-Textur verbessern
  - Implementiere militärische Munitionskiste mit Olivgrün (#556B2F, #6B8E23)
  - Erstelle Farbverlauf für 3D-Effekt der Box
  - Füge sichtbare Patronenspitzen in Gold (#FFD700) hinzu (3-4 Stück)
  - Zeichne schwarze Riemen über die Kiste
  - Implementiere "AMMO" Beschriftung auf weißem Label
  - Erstelle Deckel mit dunklerer Farbe (#3A4A1F)
  - Füge Schattierungen für Tiefenwirkung hinzu
  - _Anforderungen: 5.3_

- [x] 8. Waffen-Textur verbessern
  - Implementiere erkennbare Gewehrform mit Lauf, Griff und Magazin
  - Erstelle metallische Grautöne (#1A1A1A, #2A2A2A, #4A4A4A) mit Farbverläufen
  - Zeichne detaillierte Komponenten: Visier, Schulterstütze, Abzug
  - Füge Magazin unter dem Hauptkörper hinzu
  - Implementiere Highlights für Metall-Glanz-Effekt
  - Erstelle realistische Proportionen für Sturmgewehr
  - Füge kleine Details wie Schrauben oder Rillen hinzu
  - _Anforderungen: 5.4_

- [x] 9. Normale Tür-Textur verbessern
  - Implementiere detaillierte Holzmaserung mit mehreren Brauntönen (#654321, #8B4513, #4A4A4A)
  - Erstelle sichtbare Türfüllungen/Paneele mit vertikalen Brettern
  - Zeichne goldenen Türgriff (#FFD700, #B8860B) mit 3D-Effekt
  - Füge dunkle Metallscharniere hinzu
  - Implementiere Schattierungen für 3D-Wirkung (Schatten an Rändern)
  - Erstelle Fugen zwischen den Brettern
  - Positioniere Türgriff auf der rechten Seite
  - _Anforderungen: 6.1_

- [x] 10. Exit-Tür-Textur verbessern
  - Implementiere deutlich grüne Färbung (#228B22, #32CD32, #006400) zur Unterscheidung
  - Erstelle ähnliche Struktur wie normale Tür (Bretter, Fugen)
  - Zeichne großes, gut sichtbares Exit-Symbol (X oder Pfeil) in Gold (#FFD700)
  - Füge Leuchteffekt oder hellen Rand für Aufmerksamkeit hinzu
  - Implementiere hohen Kontrast für bessere Sichtbarkeit
  - Erstelle ähnliche Detailstufe wie normale Tür
  - Positioniere Symbol zentral auf der Tür
  - _Anforderungen: 6.2_

- [x] 11. Konsistenz und Qualitätssicherung
  - Überprüfe alle Texturen auf ähnliche Detaildichte
  - Stelle sicher, dass alle Texturen Farbverläufe und Schattierungen verwenden
  - Verifiziere korrekte Auflösungen (64x64 für Gegner/Items, 32x32 für Wände/Türen)
  - Teste visuelle Unterscheidbarkeit aller Gegner- und Item-Typen
  - Prüfe Lesbarkeit und Erkennbarkeit im Spiel-Kontext
  - _Anforderungen: 7.1, 7.2, 7.3_

- [ ]* 12. Performance-Validierung
  - Messe Textur-Generierungszeit beim Spielstart
  - Vergleiche mit vorheriger Ladezeit (sollte nicht mehr als 10% länger sein)
  - Teste Framerate während des Spiels mit neuen Texturen
  - Überprüfe Speicherverbrauch der Canvas-Elemente
  - Verifiziere, dass alle Texturen prozedural generiert werden (keine externen Dateien)
  - _Anforderungen: 8.1, 8.2, 8.3_
